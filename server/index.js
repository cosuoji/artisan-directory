import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cron from "node-cron";
import User from "./models/User.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

//routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"; // Don't forget the .js!
import paymentRoutes from "./routes/payments.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import webhookRoutes from "./routes/webhook.js";
import adminRoutes from "./routes/admin.js";

// Cron Jobs
import { initCronJobs } from "./utils/cronJobs.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1); // Crucial for Render/Netlify/Cloudflare

// Middleware
//

const allowedOrigins = [
  "http://localhost:5173",
  "https://abegfix.com",
  "https://www.abegfix.com",
  "https://theartisanhub.onrender.com", // Add your backend URL just in case
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Log the origin to Render logs so we can see the culprit
      console.log("Incoming Origin:", origin);

      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked: ${origin} is not in allowedOrigins`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

app.use(express.json()); // Body parser
app.use(cookieParser());

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

// Init cron jobs
initCronJobs();

app.use("/api", globalLimiter);
app.get("/", (req, res) => {
  res.send("Abeg Fix API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/admin", adminRoutes);

// Health check (usually left without a limiter so monitoring tools don't get blocked)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
