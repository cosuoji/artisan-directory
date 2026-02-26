import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const cleanupUnverifiedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find users who are NOT verified and were created more than 24 hours ago
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await User.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: cutoffDate },
    });

    console.log(
      `Successfully deleted ${result.deletedCount} unverified accounts.`,
    );
    process.exit();
  } catch (err) {
    console.error("Cleanup Error:", err);
    process.exit(1);
  }
};

cleanupUnverifiedUsers();
