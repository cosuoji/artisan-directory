import React, { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const ReviewSection = ({ artisanId, reviews, setReviews, currentUser }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (currentUser?.role !== "customer") {
      return toast.error("Only registered customers can leave reviews.");
    }

    setSubmitting(true);
    try {
      const { data } = await API.post("/reviews", {
        artisanId,
        rating,
        comment,
      });
      toast.success("Review posted!");
      setReviews([data, ...reviews]);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-20 pt-10 border-t border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">
        Customer Reviews
      </h3>

      {/* REVIEW FORM */}
      {currentUser?.role === "customer" ? (
        <form
          onSubmit={handleReviewSubmit}
          className="mb-16 bg-gray-50 p-8 rounded-3xl border border-gray-100"
        >
          <h4 className="font-black text-gray-900 mb-4 uppercase tracking-tighter">
            Leave a Review
          </h4>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition ${rating >= star ? "text-yellow-400 scale-110" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            rows="4"
            className="w-full p-5 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition"
            placeholder="How was your experience?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 bg-[#1E3A8A] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-900 transition disabled:bg-gray-400"
          >
            {submitting ? "Posting..." : "Submit My Review"}
          </button>
        </form>
      ) : (
        !currentUser && (
          <div className="mb-12 p-6 bg-blue-50 rounded-2xl text-blue-800 text-sm font-bold text-center">
            Please log in as a Customer to leave a review.
          </div>
        )
      )}

      {/* REVIEWS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-black text-gray-900 uppercase text-xs tracking-widest">
                    {rev.customer?.firstName}{" "}
                    {rev.customer?.lastName?.charAt(0)}.
                  </p>
                  <div className="text-yellow-400 text-xs mt-1">
                    {"★".repeat(rev.rating)}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 italic">"{rev.comment}"</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic col-span-2 py-10 text-center">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
