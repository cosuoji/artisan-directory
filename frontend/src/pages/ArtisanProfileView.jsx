import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const ArtisanProfileView = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Artisan Data
        const artisanRes = await API.get(`/users/artisan/${id}`);
        setArtisan(artisanRes.data);

        // 2. Fetch Reviews for this artisan
        const reviewsRes = await API.get(`/reviews/artisan/${id}`);
        setReviews(reviewsRes.data);

        // 3. Get current logged-in user (to check role)
        const userRes = await API.get("/auth/me");
        setCurrentUser(userRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await API.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted");
      // Filter out the deleted review from the state
      setReviews(reviews.filter((rev) => rev._id !== reviewId));
    } catch (err) {
      toast.error("Could not delete review");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (currentUser?.role !== "customer") {
      return toast.error("Only registered customers can leave reviews.");
    }

    setSubmitting(true);
    try {
      const { data } = await API.post("/reviews", {
        artisanId: id,
        rating,
        comment,
      });
      toast.success("Review posted successfully!");
      setReviews([data, ...reviews]); // Add new review to the top of the list
      setComment(""); // Reset form
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-bold text-gray-400 uppercase tracking-widest">
        Loading Artisan Details...
      </div>
    );
  if (!artisan)
    return <div className="p-20 text-center">Artisan not found.</div>;

  const profile = artisan.artisanProfile || {};

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* --- HEADER SECTION --- */}
        <div className="h-64 bg-[#1E3A8A] relative">
          <div className="absolute -bottom-16 left-8">
            <img
              src={profile.profilePic || "https://via.placeholder.com/150"}
              alt={profile.businessName}
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {profile.category || "Professional"}
              </span>
              <h1 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
                {profile.businessName ||
                  `${artisan.firstName} ${artisan.lastName}`}
              </h1>
              <p className="text-gray-500 flex items-center gap-1 mt-1 font-medium">
                📍 {profile.address || "Lagos, Nigeria"}
              </p>
            </div>

            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
            >
              Contact on WhatsApp
            </a>
          </div>

          <hr className="my-10 border-gray-100" />

          {/* --- MAIN CONTENT: BIO & RATING --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
                About the Business
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {profile.bio || "This artisan hasn't added a bio yet."}
              </p>

              {/* --- PORTFOLIO GALLERY --- */}
              <div className="mt-12">
                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter">
                  Work Portfolio
                </h3>
                {profile.portfolio?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.portfolio.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
                      >
                        <img
                          src={img}
                          alt="Work sample"
                          className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400 italic">
                    No portfolio images uploaded yet.
                  </div>
                )}
              </div>
            </div>

            {/* --- SIDEBAR: RATING & VERIFICATION --- */}
            <div className="space-y-6">
              <div className="bg-[#1E3A8A] p-8 rounded-3xl text-white shadow-xl shadow-blue-100">
                <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70 mb-2">
                  Artisan Score
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black">
                    {profile.rating?.toFixed(1) || "5.0"}
                  </span>
                  <div className="text-yellow-400 text-xl tracking-tighter">
                    ★★★★★
                  </div>
                </div>
                <p className="text-xs mt-4 opacity-80 leading-relaxed">
                  Calculated from {reviews.length} verified customer reviews.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-200 p-6 rounded-3xl">
                <h4 className="font-bold text-gray-900 mb-3">Trust Badges</h4>
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  ✅ Verified Identity
                </div>
              </div>
            </div>
          </div>

          {/* --- REVIEWS SECTION --- */}
          <div className="mt-20 pt-10 border-t border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">
              Customer Reviews
            </h3>

            {/* REVIEW FORM: ONLY FOR CUSTOMERS */}
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
                  placeholder="Tell others about your experience with this professional..."
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
                  Please log in as a Customer to leave a review for this
                  artisan.
                </div>
              )
            )}

            {/* REVIEWS LIST */}
            {/* REVIEWS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-white relative group"
                >
                  {/* DELETE BUTTON: Only show if the logged-in user is the owner */}
                  {currentUser?._id === (rev.customer?._id || rev.customer) && (
                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition"
                      title="Delete Review"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfileView;
