import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // To trigger re-check on navigation

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setRole(null);
        return;
      }

      try {
        // Fetch current user details from our new backend endpoint
        const { data } = await API.get("/auth/me");
        setUser(data);
        setRole(data.role);
      } catch (err) {
        // If token is expired or invalid, clear everything
        localStorage.removeItem("token");
        setUser(null);
        setRole(null);
      }
    };

    checkUser();
  }, [location]); // Re-run check when the URL changes (e.g., after login/logout)

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* SHARED MENU */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
            <Link
              to="/directory"
              className="text-gray-600 hover:text-blue-700 text-sm md:text-base font-medium"
            >
              Directory
            </Link>

            {user ? (
              <>
                {role === "customer" && (
                  <Link
                    to="/favorites"
                    className="text-gray-600 hover:text-blue-700 text-sm md:text-base font-medium hidden sm:block"
                  >
                    Favorites
                  </Link>
                )}

                <Link
                  to={
                    role === "artisan"
                      ? "/artisan-dashboard"
                      : "/customer-profile"
                  }
                  className="text-gray-600 hover:text-blue-700 text-sm md:text-base font-medium"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-[#1E3A8A] text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg hover:bg-black transition text-xs md:text-sm font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-700 text-sm md:text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#1E3A8A] text-white px-3 py-1.5 md:px-6 md:py-2 rounded-lg hover:bg-black transition text-xs md:text-sm font-bold text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
