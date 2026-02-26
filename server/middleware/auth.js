import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // ALLOW access to the verify-email route even if unverified
    // but BLOCK other routes
    if (!req.user.isEmailVerified && req.path !== "/verify-email") {
      return res.status(403).json({
        msg: "Please verify your email to continue.",
        unverified: true,
      });
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
