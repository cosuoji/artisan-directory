import express from "express";
import axios from "axios";
import { protect, authorize } from "../middleware/auth.js";
import User from "../models/User.js";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// --- PREMBLY BVN HELPER (v1 API) ---
const verifyBVNWithPrembly = async (bvn) => {
  const url = "https://api.prembly.com/verification/bvn";

  try {
    const response = await axios.post(
      url,
      { number: bvn.toString() },
      {
        headers: {
          "x-api-key": process.env.PREMBLY_SECRET_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    if (response.data.status && response.data.response_code === "00") {
      return response.data.data;
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
  windowMs: 15 * 60 * 1000,
  max: 5,
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
      const bvnData = await verifyBVNWithPrembly(bvn);

      const normalize = (phone) =>
        phone.toString().replace(/\D/g, "").slice(-10);

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

      if (accountFirst !== bvnFirst || accountLast !== bvnLast) {
        return res.status(400).json({
          msg: `Name Mismatch! The BVN belongs to ${bvnFirst} ${bvnLast}, not ${req.user.firstName} ${req.user.lastName}.`,
        });
      }

      if (accountPhone !== bvnPhone) {
        return res.status(400).json({
          msg: `Phone Mismatch! The phone number on your BVN does not match the one on your profile.`,
        });
      }

      res
        .status(200)
        .json({ msg: "Identity & Phone confirmed. Proceed to payment." });
    } catch (err) {
      console.error("BVN Verification Error:", err.message);

      if (err.response) {
        const externalStatus = err.response.status;
        const externalMsg =
          err.response.data?.detail || "Identity service is temporarily down.";

        return res.status(externalStatus).json({
          msg: externalMsg,
          isProviderError: externalStatus >= 500,
        });
      }

      res
        .status(500)
        .json({ msg: "An internal error occurred. Please try again." });
    }
  },
);

// --- MAIN PAYMENT VERIFICATION ROUTE ---
// Removed authorize("artisan") so Customers can upgrade to Premium too
router.post("/", protect, async (req, res) => {
  // Extracted firstName and lastName here to prevent ReferenceErrors in the "verified" block
  const { reference, type, firstName, lastName } = req.body;

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
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now for both Pro and Premium

    // 2. Handle Logic based on Subscription Type
    if (type === "pro") {
      update = {
        "artisanProfile.subscriptionTier": "pro",
        "artisanProfile.proExpiresAt": expiryDate,
      };
    } else if (type === "verified") {
      // Identity verification fallback check
      if (firstName && lastName) {
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
      }

      update = { "artisanProfile.isVerified": true };
    } else if (type === "premium") {
      // NEW: Customer Premium Logic
      if (req.user.role !== "customer") {
        return res
          .status(403)
          .json({ msg: "Only customers can upgrade to premium." });
      }

      update = {
        "customerProfile.premiumStatus": "premium",
        "customerProfile.premiumExpiresAt": expiryDate,
      };
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
