import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user.id comes from your 'protect' middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Update Artisan Profile
// @route   PUT /api/auth/update-profile
// @access  Private (Artisan only)
export const updateProfile = async (req, res) => {
  try {
    const { artisanProfile } = req.body;

    // Find user and update the artisanProfile object
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { artisanProfile } },
      { new: true, runValidators: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Security tip: Don't tell the attacker if the email exists.
      // Just say "If an account exists, an email was sent."
      return res
        .status(200)
        .json({ msg: "If an account exists, a reset link has been sent." });
    }

    // 1. Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash the token and save to DB (never store raw tokens)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // 3. Create the Reset URL
    // This points to your React frontend route
    const resetUrl = `${process.env.FRONTEND_URL}/update-password/${resetToken}`;

    // 4. Send the Email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #1E3A8A; text-transform: uppercase;">Password Reset Request</h2>
        <p>Hello ${user.firstName},</p>
        <p>You requested a password reset for your <b>Abeg Fix</b> account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1E3A8A; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset My Password</a>
        </div>
        <p style="color: #64748b; font-size: 12px;">This link will expire in 60 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(user.email, "Password Reset - Abeg Fix", htmlContent);

    res.status(200).json({ msg: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Email could not be sent" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // 1. Re-hash the token sent in the URL to match the one in our DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // 2. Find the user with this token AND check if the token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // $gt means "Greater Than"
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    // 3. Set the new password
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    // 4. Hash the new password before saving
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    // 5. Clear the reset fields so the token can't be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ msg: "Password reset successful! You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during password reset" });
  }
};
