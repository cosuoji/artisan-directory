// utils/cronJobs.js
import cron from "node-cron";
import User from "../models/User.js";

export const initCronJobs = () => {
  // Runs once a day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("--- STARTING DAILY MAINTENANCE ---");

    try {
      // 1. Downgrade expired Pro accounts
      // Note: 'role' is top-level, not inside artisanProfile
      const expiryResult = await User.updateMany(
        {
          role: "artisan",
          "artisanProfile.subscriptionTier": "pro",
          "artisanProfile.proExpiresAt": { $lt: new Date() },
        },
        {
          $set: {
            "artisanProfile.subscriptionTier": "free",
            "artisanProfile.proExpiresAt": null,
          },
        },
      );
      console.log(
        `Expired: ${expiryResult.modifiedCount} accounts downgraded.`,
      );

      // 2. Cleanup unverified accounts older than 24 hours
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const cleanupResult = await User.deleteMany({
        isEmailVerified: false,
        createdAt: { $lt: cutoffDate },
      });
      console.log(
        `Cleanup: Removed ${cleanupResult.deletedCount} unverified users.`,
      );
    } catch (err) {
      console.error("Maintenance Error:", err);
    }
  });
};
