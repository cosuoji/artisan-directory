import express from "express";
import axios from "axios";
import { protect, authorize } from "../middleware/auth.js";
import User from "../models/User.js";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// routes/payments.js
//

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

const bvnLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many BVN verification attempts. Please try again later.",
});

router.post(
  "/verify-bvn-only",
  protect,
  bvnLimit,
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

      // Check if it's an Axios error with a response from Prembly
      if (err.response) {
        const externalStatus = err.response.status;
        const externalMsg =
          err.response.data?.detail || "Identity service is temporarily down.";

        // Pass the actual status (like 504 or 503) to your frontend
        return res.status(externalStatus).json({
          msg: externalMsg,
          isProviderError: externalStatus >= 500, // Flag to tell frontend it's not the user's fault
        });
      }

      // Fallback for generic server errors (e.g., database issues)
      res
        .status(500)
        .json({ msg: "An internal error occurred. Please try again." });
    }
  },
);

router.post("/", protect, authorize("artisan"), async (req, res) => {
  // Destructure what we need; NIN is ignored/not saved for security as per your notes
  const { reference, type } = req.body;

  try {
    // 1. Verify Payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (response.data.data.status !== "success") {
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    let update = {};

    // 2. Handle Logic based on Subscription Type
    if (type === "pro") {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      update = {
        "artisanProfile.subscriptionTier": "pro",
        "artisanProfile.proExpiresAt": expiryDate,
      };
    } else if (type === "verified") {
      // Perform Name Match check (Mocking identity API response)
      // Replace this with your actual identity verification service call

      const isMatch =
        req.user.firstName.toLowerCase().trim() ===
          firstName.toLowerCase().trim() &&
        req.user.lastName.toLowerCase().trim() ===
          lastName.toLowerCase().trim();

      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: "Identity verification failed. Name mismatch." });
      }

      update = { "artisanProfile.isVerified": true };
    }

    // 3. Update Database once with the 'update' object built above
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true },
    );

    return res.json({
      msg: `Successfully upgraded to ${type}!`,
      user: updatedUser,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
