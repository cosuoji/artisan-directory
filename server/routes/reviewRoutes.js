import express from "express";

import {
  addReview,
  getArtisanReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/auth.js"; // Your JWT middleware

const router = express.Router();
// @route   POST api/reviews
// @desc    Add a review for an artisan
// @access  Private (Customers only)
router.post("/", protect, addReview);

// @route   GET api/reviews/artisan/:artisanId
// @desc    Get all reviews for a specific artisan
// @access  Public
router.get("/artisan/:artisanId", getArtisanReviews);
router.delete("/:id", protect, deleteReview);

export default router;
