import express from "express";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("artisan"), async (req, res) => {
  const { reference, type } = req.body;

  try {
    // 1. Call Paystack API to verify reference
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );

    if (response.data.data.status === "success") {
      const update =
        type === "pro"
          ? { "artisanProfile.subscriptionTier": "pro" }
          : { "artisanProfile.isVerified": true };

      await User.findByIdAndUpdate(req.user.id, { $set: update });

      return res.json({ msg: `Upgrade successful! You are now ${type}.` });
    }

    res.status(400).json({ msg: "Payment verification failed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error during verification" });
  }
});

export default router;
