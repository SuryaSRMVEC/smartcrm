import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const PublicRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;