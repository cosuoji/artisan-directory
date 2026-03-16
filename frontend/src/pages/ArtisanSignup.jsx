import React, { useState } from "react";
import API from "../api/axios"; // Import your Axios instance
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useSEO from "../hooks/useSEO";

const ArtisanSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    businessName: "",
    category: "",
    whatsapp: "",
  });

  useSEO({ title: "Artisan Signup" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend should now set the HttpOnly cookie in this response
      const res = await API.post("/auth/signup-artisan", formData);

      // 1. Store ONLY non-sensitive UI info
      localStorage.setItem("email_to_verify", formData.email);

      // 2. We don't store the token! The browser has it in a cookie now.

      toast.success("Account created! Please verify your email.");
      navigate("/verify-email");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Artisan Signup
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Join the network of Lagos professionals.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              required
              className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <input
            type="text"
            placeholder="Business Name"
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category (e.g. Tailor, Plumber)"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="WhatsApp Number (e.g. 080123...)"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, whatsapp: e.target.value })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] text-white p-4 rounded-lg font-bold hover:bg-blue-900 transition mt-4 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Create My Artisan Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArtisanSignup;
