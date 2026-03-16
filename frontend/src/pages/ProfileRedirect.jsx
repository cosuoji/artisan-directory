import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProfileRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode the token locally - no API call needed!
      const decoded = jwtDecode(token);

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      // Route based on the role we put in the JWT on the backend
      if (decoded.role === "artisan") {
        navigate("/artisan-dashboard");
      } else {
        navigate("/customer-profile");
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return null; // This component is so fast it doesn't even need a loading spinner
};

export default ProfileRedirect;
