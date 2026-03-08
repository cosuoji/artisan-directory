import express from "express";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/auth.js"; // Adjust path
import AdminLog from "../models/AdminLog.js";

const router = express.Router();

// ALL routes here require standard login AND admin privileges
router.use(protect);
router.use(authorize("admin"));

// 1. GET ALL USERS (With basic filtering)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 2. TOGGLE VERIFICATION STATUS
router.put("/users/:id/verify", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "artisan") {
      return res.status(404).json({ msg: "Artisan not found" });
    }

    user.artisanProfile.isVerified = !user.artisanProfile.isVerified;
    await user.save();

    // --- ADDED: The Audit Log Block ---
    await AdminLog.create({
      adminId: req.user._id,
      adminName: `${req.user.firstName} ${req.user.lastName}`,
      // We dynamically change the string based on what just happened
      action: user.artisanProfile.isVerified
        ? "VERIFIED_ARTISAN"
        : "UNVERIFIED_ARTISAN",
      targetUserId: user._id,
      targetUserEmail: user.email,
    });

    res.json({
      msg: `Verification set to ${user.artisanProfile.isVerified}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 3. TOGGLE SUBSCRIPTION TIER (Free/Pro)
router.put("/users/:id/tier", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "artisan") {
      return res.status(404).json({ msg: "Artisan not found" });
    }

    const newTier =
      user.artisanProfile.subscriptionTier === "free" ? "pro" : "free";
    user.artisanProfile.subscriptionTier = newTier;
    await user.save();

    await AdminLog.create({
      adminId: req.user._id,
      adminName: `${req.user.firstName} ${req.user.lastName}`,
      // We dynamically change the string to reflect the tier change
      action: newTier === "pro" ? "UPGRADED_TO_PRO" : "DOWNGRADED_TO_FREE",
      targetUserId: user._id,
      targetUserEmail: user.email,
    });

    res.json({ msg: `Tier updated to ${newTier}`, user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 4. TOGGLE ACCOUNT BAN
router.put("/users/:id/ban", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Prevent admins from banning themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: "You cannot ban yourself." });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ msg: `User ban status set to ${user.isBanned}`, user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/users/:id/ban", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ msg: "User not found" });

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: "You cannot ban yourself." });
    }

    targetUser.isBanned = !targetUser.isBanned;
    await targetUser.save();

    // --- ADDED: Create the Immutable Log ---
    await AdminLog.create({
      adminId: req.user._id,
      adminName: `${req.user.firstName} ${req.user.lastName}`,
      action: targetUser.isBanned ? "BANNED_USER" : "UNBANNED_USER",
      targetUserId: targetUser._id,
      targetUserEmail: targetUser.email,
    });

    res.json({
      msg: `User ban status set to ${targetUser.isBanned}`,
      targetUser,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// --- ADDED: Route to fetch logs (GET ONLY, no PUT or DELETE exists) ---
router.get("/logs", async (req, res) => {
  try {
    const logs = await AdminLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
export default router;
