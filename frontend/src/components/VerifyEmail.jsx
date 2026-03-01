import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0); // 0 means button is active
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Grab the login function

  // We can grab the email from localStorage if we saved it during signup
  const email = localStorage.getItem("email_to_verify");

  useEffect(() => {
    if (!email) {
      toast.error("No email found to verify. Please sign up again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/verify-email", { email, otp });

      // NEW: Use the context function! This instantly updates the whole app.
      login(res.data.token, res.data.user);

      toast.success("Email verified! Welcome to Abeg Fix.");
      localStorage.removeItem("email_to_verify");

      // Redirect
      navigate(
        res.data.user.role === "artisan" ? "/artisan-dashboard" : "/directory",
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  // Handle the countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return; // Block click if timer is active

    try {
      await API.post("/auth/resend-otp", { email });
      toast.success("New code sent!");
      setCountdown(60); // Start 60s cooldown
    } catch (err) {
      toast.error("Wait a bit before trying again.");
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
          disabled={countdown > 0}
          className={`mt-6 font-medium ${countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}
        >
          {countdown > 0
            ? `Resend code in ${countdown}s`
            : "Didn't get a code? Resend"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
