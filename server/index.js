import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"; // Don't forget the .js!
import reviewRoutes from "./routes/reviewRoutes.js";
import cron from "node-cron";
import User from "./models/User.js";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
app.set("trust proxy", 1); // Crucial for Render/Netlify/Cloudflare

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

// Global limiter: Max 100 requests per 15 mins
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Too many requests, please try again later." },
  standardHeaders: true, // Returns RateLimit-Limit headers
  legacyHeaders: false,
});

// Stricter limiter for Auth (Signups/OTP): Max 5 attempts per hour
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { msg: "Too many auth attempts. Please wait an hour." },
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch((err) => console.error("Database connection error:", err));

// 1. Apply Global Limiter to ALL /api routes
app.use("/api", globalLimiter);

// 2. Apply Strict Auth Limiter specifically to Auth routes
// This stacks on top of the global one
//app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/auth", authRoutes);

// 3. Regular routes (only governed by globalLimiter)
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check (usually left without a limiter so monitoring tools don't get blocked)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
