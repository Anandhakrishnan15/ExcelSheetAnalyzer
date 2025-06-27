import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
