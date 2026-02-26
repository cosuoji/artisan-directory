import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

// Prevent a user from leaving multiple reviews for the same artisan
ReviewSchema.index({ customer: 1, artisan: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
