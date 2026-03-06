import mongoose from "mongoose";

const { Schema, model } = mongoose;

const portfolioLimit = function (val) {
  // 'this' refers to the user document being saved
  const tier = this.artisanProfile?.subscriptionTier || "free";
  const limit = tier === "pro" ? 30 : 3;
  return val.length <= limit;
};
const UserSchema = new Schema(
  {
    // Global fields (for everyone)
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "artisan"],
      default: "customer",
    },
    // --- ADDED: Verification Fields ---
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationOTP: String,
    otpExpires: Date,

    // Password Reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // --- ADDED: Customer Specific Fields ---
    customerProfile: {
      lga: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: false, // Remove default: "Point"
        },
        coordinates: {
          type: [Number],
          required: false,
        },
      },
    },

    // Password Reset fields (Top level so both roles can use them)
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Artisan specific fields
    artisanProfile: {
      businessName: String,
      category: String,
      whatsapp: String,
      nin: String,
      bio: String,
      profilePic: String,
      address: String, // The readable text
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: false, // Remove default: "Point"
        },
        coordinates: {
          type: [Number],
          required: false,
        },
      },
      portfolio: {
        type: [String],
        validate: [
          portfolioLimit,
          "Upgrade to Pro to upload more than 3 portfolio images!",
        ],
      },
      isVerified: { type: Boolean, default: false },
      rating: { type: Number, default: 0 },
      subscriptionTier: {
        type: String,
        enum: ["free", "pro"],
        default: "free",
      },
      isSponsored: { type: Boolean, default: false },
    },

    // Favorites: Array of Artisan IDs
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
); // Good for tracking when accounts were created

UserSchema.index({ "artisanProfile.location": "2dsphere" });
UserSchema.index({ "customerProfile.location": "2dsphere" });

export default model("User", UserSchema);
