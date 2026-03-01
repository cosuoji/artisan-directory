import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Prevent flicker while checking token

  if (!isAuthenticated) {
    // Not logged in? Send them to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Logged in but wrong role? Send them home
    return <Navigate to="/" replace />;
  }

  // All good? Render the child component
  return <Outlet />;
};

export default ProtectedRoute;
