import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // We can grab the email from localStorage if we saved it during signup
  const email = localStorage.getItem("email_to_verify");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/verify-email", {
        email: email, // From localStorage
        otp: otp,
      });
      toast.success("Email verified! Redirecting...");

      // Remove temporary email storage
      localStorage.removeItem("email_to_verify");

      // Redirect based on role (stored in JWT or returned from API)
      const role = localStorage.getItem("user_role");
      navigate(role === "artisan" ? "/artisan-dashboard" : "/directory");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await API.post("/auth/resend-otp", { email });
      toast.success("New code sent to your email!");
    } catch (err) {
      toast.error("Failed to resend. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          Check your email
        </h2>
        <p className="text-gray-500 mb-6">
          We sent a 6-digit code to <br />
          <b>{email}</b>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength="6"
            required
            className="w-full p-4 text-center text-2xl tracking-[10px] font-bold border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full bg-[#1E3A8A] text-white p-4 rounded-xl font-bold hover:bg-blue-900 transition disabled:bg-gray-300"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          onClick={handleResend}
          className="mt-6 text-blue-600 font-medium hover:underline"
        >
          Didn't get a code? Resend
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
