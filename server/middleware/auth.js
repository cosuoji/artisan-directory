import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // Look for the token in cookies instead of headers
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Your existing logic for banned/unverified users remains the same
    if (req.user.isBanned) {
      return res.status(403).json({ msg: "Account suspended." });
    }

    if (
      !req.user.isEmailVerified &&
      !req.originalUrl.includes("verify-email")
    ) {
      return res.status(403).json({ msg: "Verify email.", unverified: true });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Optional: Role-based middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "User role not authorized" });
    }
    next();
  };
};
