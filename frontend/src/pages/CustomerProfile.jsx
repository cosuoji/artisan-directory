import React, { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profilePic: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // In MERN, we can often get profile and favorites in one call,
  // but we'll stick to your tab-based fetch for efficiency.
  useEffect(() => {
    if (activeTab === "favorites") fetchFavorites();
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/auth/me");
      // Mapping from Mongo CamelCase to state
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        profilePic: data.profilePic || "",
      });
    } catch (err) {
      toast.error("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // We'll create a specific route for this: GET /api/users/favorites
      const { data } = await API.get("/users/favorites");
      setFavorites(data);
    } catch (err) {
      toast.error("Could not load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/auth/update-customer", profile);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading && activeTab === "profile")
    return <div className="p-20 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {["profile", "favorites", "security"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-6 font-bold uppercase text-xs tracking-widest transition-colors ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        {activeTab === "profile" && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border mb-4">
                <img
                  src={"https://avatar.iran.liara.run/public/33"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <button
                type="button"
                className="text-sm text-blue-600 font-bold hover:underline"
              >
                Change Photo
              </button>*/}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={profile.firstName}
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                value={profile.lastName}
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              placeholder="Phone Number"
              value={profile.phoneNumber}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
            />

            <button className="w-full bg-[#1E3A8A] text-white p-3 rounded-lg font-bold hover:bg-blue-900 transition">
              Save Changes
            </button>
          </form>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Account Security</h3>
            <p className="text-sm text-gray-500">
              Want to change your password? We'll send a secure link to your
              email.
            </p>
            <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition">
              Send Reset Email
            </button>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <p className="text-center col-span-2 py-10">
                Loading favorites...
              </p>
            ) : favorites.length > 0 ? (
              favorites.map((artisan) => (
                <div
                  key={artisan._id}
                  className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition bg-white"
                >
                  <img
                    src={
                      artisan.artisanProfile?.profilePic ||
                      "https://via.placeholder.com/50"
                    }
                    className="w-12 h-12 rounded-full object-cover border"
                    alt="Artisan"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">
                      {artisan.artisanProfile?.businessName || "Professional"}
                    </h4>
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-tighter">
                      {artisan.artisanProfile?.category}
                    </p>
                  </div>
                  <Link
                    to={`/artisan/${artisan._id}`}
                    className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 py-10 text-center col-span-2">
                You haven't added any favorites yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
