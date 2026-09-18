import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // ← now from context, not a standalone file

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;