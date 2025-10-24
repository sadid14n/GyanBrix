import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // Not logged in → go to login page
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but Firestore profile not yet created → go to signup page
  if (!profile) return <Navigate to="/signup" replace />;

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(profile.role))
    return <Navigate to="/unauthorized" replace />;

  // Everything OK → render page
  return children;
};

export default ProtectedRoute;
