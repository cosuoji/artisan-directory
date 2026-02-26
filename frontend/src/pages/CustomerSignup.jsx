import React, { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    lga: "",
    // We add coordinates in case they use the GPS feature
    coordinates: null,
  });

  // --- THE NEW GEOLOCATION FUNCTION ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser doesn't support geolocation.");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          lga: "Exact GPS Location", // Give visual feedback in the dropdown
          coordinates: [longitude, latitude], // [lng, lat] format for backend
        });
        toast.success("Location locked in!");
        setGettingLocation(false);
      },
      (error) => {
        toast.error("Could not get location. Please select an area manually.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/signup-customer", formData);

      // 1. Store token for the "Verify" request (which is protected)
      localStorage.setItem("token", res.data.token);
      // 2. Store email/role temporarily for the Verify UI
      localStorage.setItem("email_to_verify", formData.email);
      localStorage.setItem("user_role", res.data.role);

      toast.success("Account created! Please verify your email.");
      navigate("/verify-email"); // REDIRECT HERE INSTEAD
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
          Find Local Artisans
        </h2>
        <p className="text-gray-500 mb-8 text-sm font-medium">
          Create an account to save your favorite artisans and get
          location-based recommendations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength="6"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* THE HYBRID LOCATION FIELD */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                required
                value={formData.lga}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all text-sm text-gray-700"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lga: e.target.value,
                    coordinates: null,
                  })
                }
              >
                <option value="">Where in Lagos are you?</option>
                {formData.lga === "Exact GPS Location" && (
                  <option
                    value="Exact GPS Location"
                    className="font-bold text-blue-600"
                  >
                    📍 Exact GPS Location Detected
                  </option>
                )}
                <option value="Ikeja">Ikeja / Mainland</option>
                <option value="Surulere">Surulere</option>
                <option value="Yaba">Yaba / Ebute Metta</option>
                <option value="Eti-Osa">Lekki / Victoria Island / Ikoyi</option>
                <option value="Alimosho">Alimosho / Egbeda</option>
                <option value="Ikorodu">Ikorodu</option>
                <option value="Other">Other</option>
              </select>

              {/* GPS Button */}
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="p-4 bg-blue-50 text-[#1E3A8A] rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
                title="Use my exact GPS location"
              >
                {gettingLocation ? "⏳" : "📍"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-100 disabled:bg-gray-300 mt-6"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignup;
