import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Use context instead of local storage

  useEffect(() => {
    if (loading) return; // Wait for the /auth/me check to finish

    if (!user) {
      navigate("/login");
      return;
    }

    // Route based on the user object returned from the backend
    if (user.role === "artisan") {
      navigate("/artisan-dashboard");
    } else {
      navigate("/customer-profile");
    }
  }, [user, loading, navigate]);

  return <p>Redirecting...</p>;
};

export default ProfileRedirect;
