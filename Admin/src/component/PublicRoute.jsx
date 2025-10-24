import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // ✅ Case 1: Logged in and profile exists → block login/signup
  if (user && profile) {
    return <Navigate to="/" replace />;
  }

  // ✅ Case 2: Logged in but profile not created → allow only signup
  if (user && !profile) {
    if (location.pathname !== "/signup") {
      return <Navigate to="/signup" replace />;
    }
    return children; // allow signup page
  }

  // ✅ Case 3: Not logged in → allow only login
  if (!user) {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" replace />;
    }
    return children; // allow login page
  }

  return children;
};

export default PublicRoute;
