import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Grabs the reset token from the URL: /update-password/:token
  const { token } = useParams();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hits POST /api/auth/reset-password/:token
      await API.post(`/auth/reset-password/${token}`, { password });

      toast.success("Password updated successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Link expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-6 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set New Password
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your new secure password below.
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="password"
            placeholder="New Password (min 6 chars)"
            required
            minLength="6"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] text-white p-3 rounded-lg font-bold hover:bg-blue-900 transition disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
