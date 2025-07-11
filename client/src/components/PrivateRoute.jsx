import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { token, isAdmin, loading } = useAuth();

  // Still loading user info—render nothing or a spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
};

export default PrivateRoute;
