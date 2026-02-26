import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios"; // Your custom Axios instance
import toast from "react-hot-toast";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send credentials to your Node server
      const res = await API.post("/auth/login", { email, password });

      // 2. Destructure the token and role from response
      const { token, role } = res.data;

      // 3. Save token for subsequent API calls
      localStorage.setItem("token", token);

      toast.success("Welcome back!");

      // 4. Role-based redirection logic
      if (role === "artisan") {
        navigate("/artisan-dashboard");
      } else {
        navigate("/customer-profile");
      }
    } catch (err) {
      // Handle incorrect password or "user not found"
      toast.error(
        err.response?.data?.msg || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-6 bg-gray-50">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">
          Login to manage your profile and favorites.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] text-white p-3 rounded-lg font-bold hover:bg-black transition shadow-md disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/customer-signup"
            className="text-blue-600 font-bold hover:underline"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
