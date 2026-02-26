import React, { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import BackToTopButton from "../components/BackToTopButton";

const Directory = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState(null); // Added user profile state

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [skillSearch, setSkillSearch] = useState(""); // This acts as our category search
  const [filterLocation, setFilterLocation] = useState("");
  const [filterRating, setFilterRating] = useState(0);

  // --- LOAD MORE STATE ---
  const ITEMS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // --- GEOLOCATION STATE ---
  const [userLocation, setUserLocation] = useState(null);

  // --- 1. INITIAL LOAD: USER PROFILE & ARTISANS ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await fetchUserProfile(); // Get user location first
      await fetchArtisans(); // Then fetch artisans (will use user location if available)
    };
    initData();
  }, []);

  // --- 2. RE-FETCH WHEN LOCATION CHANGES ---
  useEffect(() => {
    fetchArtisans();
  }, [userLocation, user]); // Refetch if live GPS or user profile loads

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
      setFavorites(res.data.favorites || []);
    } catch (err) {
      console.log("Not logged in or session expired");
    }
  };

  const fetchArtisans = async () => {
    try {
      setLoading(true);

      let lat = null;
      let lng = null;

      // Priority 1: Live browser GPS
      if (userLocation) {
        lat = userLocation.lat;
        lng = userLocation.lng;
      }
      // Priority 2: Saved Profile Location
      else if (user?.customerProfile?.location?.coordinates) {
        lng = user.customerProfile.location.coordinates[0];
        lat = user.customerProfile.location.coordinates[1];
      }

      const params = new URLSearchParams();
      if (lat && lng) {
        params.append("lat", lat);
        params.append("lng", lng);
      }

      // Add category if skillSearch is active
      if (skillSearch) {
        params.append("category", skillSearch);
      }

      const { data } = await API.get(`/users/artisans?${params.toString()}`);
      setArtisans(data);
    } catch (err) {
      toast.error("Failed to load directory");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast.success("GPS Active! Sorting by proximity...");
      },
      () => toast.error("Unable to retrieve location"),
    );
  };

  const handleFavoriteClick = async (artisanId) => {
    try {
      const res = await API.post(`/users/favorite/${artisanId}`);
      if (res.data.favorites) {
        setFavorites(res.data.favorites);
        toast.success(res.data.msg);
      }
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  // --- FILTERING (Frontend fallback for search/rating) ---
  const filteredArtisans = artisans.filter((artisan) => {
    const profile = artisan.artisanProfile || {};
    const matchesSearch =
      searchTerm === "" ||
      profile.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.firstName?.toLowerCase().includes(searchTerm.toLowerCase());

    // Note: Backend handles Category filtering now, but we keep this as backup
    const matchesSkill =
      skillSearch === "" ||
      profile.category?.toLowerCase().includes(skillSearch.toLowerCase());

    const matchesRating = (profile.rating || 0) >= filterRating;

    return matchesSearch && matchesSkill && matchesRating;
  });

  const displayedArtisans = filteredArtisans.slice(0, visibleCount);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
            Artisan Directory
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Showing {filteredArtisans.length} verified experts near you
          </p>
        </div>

        <button
          onClick={handleGetLocation}
          className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ${
            userLocation
              ? "bg-green-100 text-green-700"
              : "bg-white text-[#1E3A8A] border border-gray-200"
          }`}
        >
          {userLocation ? "📍 Live GPS Enabled" : "🎯 Sort By Proximity"}
        </button>
      </div>

      {/* --- SEARCHBARS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <input
          type="text"
          placeholder="What do you need? (Plumber, Tailor...)"
          className="p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600 shadow-sm transition-all"
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Name"
          className="p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm"
          value={filterRating}
          onChange={(e) => setFilterRating(Number(e.target.value))}
        >
          <option value={0}>Any Rating ⭐</option>
          <option value={4}>4+ Stars</option>
          <option value={5}>5 Stars</option>
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            Finding Artisans...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayedArtisans.map((artisan) => (
              <div
                key={artisan._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Image Section */}
                <div className="h-10 bg-gray-100 relative">
                  <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-[10px] font-black">
                    ★ {artisan.artisanProfile?.rating?.toFixed(1) || "5.0"}
                  </div>
                  <button
                    onClick={() => handleFavoriteClick(artisan._id)}
                    className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-lg"
                  >
                    <svg
                      className={`w-3 h-3 ${favorites.includes(artisan._id) ? "text-red-500 fill-current" : "text-gray-300"}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-[10px] font-black uppercase text-blue-600 mb-1">
                    {artisan.artisanProfile?.category}
                  </p>
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {artisan.artisanProfile?.businessName || artisan.firstName}
                  </h3>

                  {/* --- THE NEW DISTANCE BADGE --- */}
                  <div className="mt-2 flex items-center gap-1.5 min-h-[20px]">
                    <span className="text-[10px] text-gray-400">
                      📍 {artisan.artisanProfile?.address || "Lagos"}
                    </span>
                    {artisan.distance && (
                      <span className="bg-blue-50 text-[#1E3A8A] px-2 py-0.5 rounded-md font-black text-[9px]">
                        {artisan.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/artisan/${artisan._id}`}
                      className="flex-1 bg-gray-900 text-white text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition"
                    >
                      View
                    </Link>
                    <a
                      href={`https://wa.me/${artisan.artisanProfile?.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2.5 border border-green-500 text-green-500 rounded-xl text-xs hover:bg-green-50 transition"
                    >
                      💬
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filteredArtisans.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="px-12 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
      <BackToTopButton />
    </div>
  );
};

export default Directory;
