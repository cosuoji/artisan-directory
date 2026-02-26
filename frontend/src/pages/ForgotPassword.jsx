import React, { useState } from "react";
import API from "../api/axios"; // Your Axios instance
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hits your Node endpoint: POST /api/auth/forgot-password
      await API.post("/auth/forgot-password", { email });

      setMessage("Check your email for the password reset link!");
      toast.success("Reset email sent!");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-6 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your email and we'll send you a link to get back into your
          account.
        </p>

        {message ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-100">
            {message}
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A8A] text-white p-3 rounded-lg font-bold hover:bg-blue-900 transition disabled:bg-blue-300"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
