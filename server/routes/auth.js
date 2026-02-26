import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import { welcomeTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import {
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// @route   POST api/auth/signup-customer
router.post(
  "/signup-customer",
  [
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 }),
    check("firstName", "First name is required").notEmpty().trim(),
    check("lastName", "Last name is required").notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { email, password, firstName, lastName, lga, coordinates } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // GENERATE 6-DIGIT OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      user = new User({
        email,
        password: hashedPassword,
        role: "customer",
        firstName,
        lastName,
        emailVerificationOTP: otp,
        otpExpires: otpExpires,
        customerProfile: { lga: lga },
      });

      if (coordinates) {
        user.customerProfile.location = { type: "Point", coordinates };
      }

      await user.save();

      // Strictly tell Mongoose NOT to create this object
      user.artisanProfile = undefined;

      await user.save();

      // SEND THE EMAIL
      try {
        await sendEmail(
          user.email,
          "Verify your Abeg Fix Account",
          welcomeTemplate(user.firstName, otp, "Customer"),
        );
      } catch (mailErr) {
        console.error("Email failed to send:", mailErr);
        // We don't block registration if email fails, but we should log it
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res
        .status(201)
        .json({ token, role: user.role, msg: "OTP sent to email" });

      res.status(201).json({ token, role: user.role });
    } catch (err) {
      console.error("Signup Error:", err);
      res.status(500).json({ msg: "Server error during registration" });
    }
  },
);

// @route   POST api/auth/signup-artisan
router.post(
  "/signup-artisan",
  [
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 }),
    check("firstName", "First name is required").notEmpty().trim(),
    check("lastName", "Last name is required").notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password, firstName, lastName, category, whatsapp } =
      req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // GENERATE 6-DIGIT OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Inside signup-artisan
      user = new User({
        email,
        password: hashedPassword,
        role: "artisan",
        firstName,
        lastName,
        emailVerificationOTP: otp,
        otpExpires: otpExpires,
        artisanProfile: {
          category,
          whatsapp,
          businessName: `${firstName}'s Services`,
          // IMPORTANT: Do not define location here yet if you don't have coordinates
        },
      });

      // For artisans, you'll likely update location later in their dashboard,
      // so ensure the object isn't partially initialized now.
      user.artisanProfile.location = undefined;

      await user.save();

      // SEND THE EMAIL
      try {
        await sendEmail(
          user.email,
          "Verify your Abeg Fix Account",
          otpTemplate(user.firstName, otp, "Customer"),
        );
      } catch (mailErr) {
        console.error("Email failed to send:", mailErr);
        // We don't block registration if email fails, but we should log it
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.json({ token, role: user.role });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // 1. Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // 2. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // --- NEW: VERIFICATION CHECK ---
      if (!user.isEmailVerified) {
        return res.status(403).json({
          msg: "Please verify your email to login.",
          unverified: true,
        });
      }

      // 3. Create and return JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      // Sending both token and role so the frontend knows where to redirect
      res.json({ token, role: user.role });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

// @route   POST api/auth/verify-email
router.post("/verify-email", protect, async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isEmailVerified)
      return res.status(400).json({ msg: "Email already verified" });

    if (user.emailVerificationOTP !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Mark as verified and clear OTP fields
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully!", isEmailVerified: true });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route   PUT api/auth/update-password
// @desc    Update user password
router.put("/update-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Get user and explicitly select the password field (since we usually hide it)
    const user = await User.findById(req.user.id);

    // 2. Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    // 4. Save
    await user.save();
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth/resend-otp
// This can be used if they are logged in (via protect) or via email if they aren't
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isEmailVerified)
      return res.status(400).json({ msg: "Email already verified" });

    // Generate fresh OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOTP = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      "Your New Verification Code - Abeg Fix",
      welcomeTemplate(user.firstName, otp, user.role),
    );

    res.json({ msg: "A new verification code has been sent to your email." });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.put("/update-profile", protect, authorize("artisan"), updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword); // Notice the :token param

export default router;
