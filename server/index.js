import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"; // Don't forget the .js!
import reviewRoutes from "./routes/reviewRoutes.js";
import cron from "node-cron";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// This runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("--- RUNNING DAILY CLEANUP: DELETING UNVERIFIED ACCOUNTS ---");
  try {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: cutoffDate },
    });
    console.log(`Cleanup complete. Removed ${result.deletedCount} users.`);
  } catch (err) {
    console.error("Cleanup failed:", err);
  }
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch((err) => console.error("Database connection error:", err));

// Routes (We will create these next)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
