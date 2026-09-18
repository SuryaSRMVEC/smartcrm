import { Navigate, Outlet } from "react-router-dom";
import { hasPermission } from "../utils/permissions";
import { useAuth } from "../context/useAuth";

const RoleProtectedRoute = ({ permission }) => {
  const { role } = useAuth();

  if (!role || !hasPermission(role, permission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default RoleProtectedRoute;