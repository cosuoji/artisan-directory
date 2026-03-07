import express from "express";
import axios from "axios";
import { protect, authorize } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// routes/payments.js

router.post("/", protect, authorize("artisan"), async (req, res) => {
  const { reference, type, nin } = req.body;

  try {
    // 1. Verify Payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );

    if (response.data.data.status === "success") {
      let update = {};

      if (type === "pro") {
        update = { "artisanProfile.subscriptionTier": "pro" };
      } else if (type === "verified") {
        // 2. Perform one last Name Match check before upgrading
        // (This prevents users from skipping the Modal's pre-check)

        // MOCK: Replace with your real identity API call
        const { firstName, lastName } = { firstName: "John", lastName: "Doe" };

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

        // 3. SET VERIFIED BUT DO NOT SAVE THE NIN
        update = { "artisanProfile.isVerified": true };
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: update },
        { new: true },
      );

      // Return the updated user so the frontend can sync immediately
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

router.post(
  "/verify-nin-only",
  protect,
  authorize("artisan"),
  async (req, res) => {
    const { nin } = req.body;

    if (!nin || nin.length !== 11) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid 11-digit NIN." });
    }

    try {
      // 1. CALL EXTERNAL IDENTITY API (e.g., Prembly, VerifyMe, etc.)
      // For development, you can mock this response.
      /*
    const identityRes = await axios.post("https://api.provider.com/nin", { nin }, {
      headers: { Authorization: `Bearer ${process.env.IDENTITY_KEY}` }
    });
    const { firstName, lastName } = identityRes.data;
    */

      // MOCK DATA FOR TESTING:
      const mockNINData = { firstName: "Chibueze", lastName: "Osuoji" };
      const { firstName, lastName } = mockNINData;

      // 2. COMPARE WITH ACCOUNT DATA
      const accountFirst = req.user.firstName.toLowerCase().trim();
      const accountLast = req.user.lastName.toLowerCase().trim();
      const ninFirst = firstName.toLowerCase().trim();
      const ninLast = lastName.toLowerCase().trim();

      // Check if the names match
      if (accountFirst !== ninFirst || accountLast !== ninLast) {
        return res.status(400).json({
          msg: `Name Mismatch! The NIN belongs to ${firstName} ${lastName}, but your account is ${req.user.firstName} ${req.user.lastName}.`,
        });
      }

      // 3. IF MATCH: Send success (Do NOT update DB yet, they haven't paid!)
      res.status(200).json({ msg: "Identity confirmed. Proceed to payment." });
    } catch (err) {
      console.error("NIN Verification Error:", err.message);
      res
        .status(500)
        .json({ msg: "Identity server is down. Please try again later." });
    }
  },
);

export default router;
