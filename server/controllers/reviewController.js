import Review from "../models/Review.js";
import User from "../models/User.js";

// ADD A REVIEW
export const addReview = async (req, res) => {
  const { artisanId, rating, comment } = req.body;

  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ msg: "Only customers can leave reviews" });
    }

    const newReview = new Review({
      customer: req.user.id,
      artisan: artisanId,
      rating,
      comment,
    });

    await newReview.save();

    // Re-fetch and populate so the frontend has the name immediately
    const populatedReview = await Review.findById(newReview._id).populate(
      "customer",
      "firstName lastName",
    );

    // Recalculate Average
    const reviews = await Review.find({ artisan: artisanId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 5;

    await User.findByIdAndUpdate(artisanId, {
      "artisanProfile.rating": avgRating,
    });

    // IMPORTANT: Ensure this response is sent!
    return res.status(201).json(populatedReview);
  } catch (err) {
    console.error("Review Error:", err); // Log the actual error to your terminal
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ msg: "You have already reviewed this artisan." });
    }
    return res.status(500).json({ msg: "Server error while posting review" });
  }
};

// GET REVIEWS FOR AN ARTISAN
export const getArtisanReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ artisan: req.params.artisanId })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 }); // Newest reviews first

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ msg: "Review not found" });

    // Check if the user is the owner of the review
    if (review.customer.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const artisanId = review.artisan;
    await review.deleteOne();

    // Recalculate Rating after deletion
    const reviews = await Review.find({ artisan: artisanId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 5;

    await User.findByIdAndUpdate(artisanId, {
      "artisanProfile.rating": avgRating,
    });

    res.json({ msg: "Review removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
