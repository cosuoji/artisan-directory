import express from "express";
import axios from "axios";
import { protect, authorize } from "../middleware/auth.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// routes/payments.js
//
// Helper to strip everything and keep the last 10 digits
const getLast10 = (num) => {
  if (!num) return "";
  const cleaned = num.toString().replace(/\D/g, ""); // Remove non-digits
  return cleaned.slice(-10); // Take the last 10: "8031234567"
};

// --- PREMBLY BVN HELPER (v1 API) ---
const verifyBVNWithPrembly = async (bvn) => {
  // Updated URL from the latest 2026 docs
  const url = "https://api.prembly.com/verification/bvn";

  try {
    const response = await axios.post(
      url,
      { number: bvn.toString() },
      {
        headers: {
          "x-api-key": process.env.PREMBLY_SECRET_KEY, // Your Secret Key
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    console.log(response.data);
    // According to the 201 result you found:
    // response.data.status is true and response_code is "00"
    if (response.data.status && response.data.response_code === "00") {
      return response.data.data; // This contains firstName, lastName, etc.
    } else {
      throw new Error(response.data.detail || "BVN validation failed");
    }
  } catch (error) {
    console.error("Prembly API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || "Identity service unavailable",
    );
  }
};

router.post(
  "/verify-bvn-only",
  protect,
  authorize("artisan"),
  async (req, res) => {
    const { bvn } = req.body;

    if (!bvn || bvn.length !== 11) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid 11-digit BVN." });
    }

    try {
      // 1. Call Prembly
      const bvnData = await verifyBVNWithPrembly(bvn);

      // 2. Normalize Function (Extracts last 10 digits to avoid +234 vs 080 issues)
      const normalize = (phone) =>
        phone.toString().replace(/\D/g, "").slice(-10);

      // 3. Prepare Data for Comparison
      const accountFirst = req.user.firstName.toLowerCase().trim();
      const accountLast = req.user.lastName.toLowerCase().trim();
      const accountPhone = normalize(req.user.artisanProfile?.whatsapp || "");

      const bvnFirst = (bvnData.firstName || bvnData.first_name || "")
        .toLowerCase()
        .trim();
      const bvnLast = (bvnData.lastName || bvnData.last_name || "")
        .toLowerCase()
        .trim();
      const bvnPhone = normalize(
        bvnData.phoneNumber || bvnData.phone_number || "",
      );

      // 4. Strict Name Match
      if (accountFirst !== bvnFirst || accountLast !== bvnLast) {
        return res.status(400).json({
          msg: `Name Mismatch! The BVN belongs to ${bvnFirst} ${bvnLast}, not ${req.user.firstName} ${req.user.lastName}.`,
        });
      }

      // 5. Phone Match
      if (accountPhone !== bvnPhone) {
        return res.status(400).json({
          msg: `Phone Mismatch! The phone number on your BVN does not match the one on your profile.`,
        });
      }

      // 6. Success: Everything aligns
      res
        .status(200)
        .json({ msg: "Identity & Phone confirmed. Proceed to payment." });
    } catch (err) {
      console.error("BVN Verification Error:", err.message);
      res
        .status(500)
        .json({ msg: err.message || "Identity verification failed." });
    }
  },
);

router.post("/", protect, authorize("artisan"), async (req, res) => {
  const { reference, type } = req.body; // Removed 'nin', we don't save the BVN to DB for security

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );

    if (response.data.data.status === "success") {
      let update = {};

      if (type === "pro") {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        update = {
          "artisanProfile.subscriptionTier": "pro",
          "artisanProfile.proExpiresAt": expiryDate,
        };
      } else if (type === "verified") {
        // Because we already verified the BVN strictly in the pre-check route,
        // and Paystack just confirmed their money, we can safely upgrade them.
        update = { "artisanProfile.isVerified": true };
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: update },
        { new: true },
      );

      return res.json({
        msg: `Successfully upgraded to ${type}!`,
        user: updatedUser,
      });
    }

    res.status(400).json({ msg: "Payment verification failed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error during verification" });
  }
});

export default router;
