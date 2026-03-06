import express from "express";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

// PAYSTACK WEBHOOK ENDPOINT
router.post("/paystack", async (req, res) => {
  try {
    // 1. Verify the event signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).send("Invalid signature");
    }

    // 2. Get the event data
    const event = req.body;

    // 3. Handle 'charge.success'
    if (event.event === "charge.success") {
      const { metadata, customer } = event.data;
      const { userId, upgradeType } = metadata;

      const update =
        upgradeType === "pro"
          ? { "artisanProfile.subscriptionTier": "pro" }
          : { "artisanProfile.isVerified": true };

      await User.findByIdAndUpdate(userId, { $set: update });

      console.log(`Successfully upgraded User ${userId} to ${upgradeType}`);
    }

    // Always send 200 OK to Paystack so they stop retrying
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.sendStatus(500);
  }
});

export default router;
