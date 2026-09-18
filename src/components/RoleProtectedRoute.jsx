import { Navigate, Outlet } from "react-router-dom";
import { hasPermission } from "../utils/permissions";

const RoleProtectedRoute = ({ permission }) => {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userRole = currentUser?.role;

  if (!userRole || !hasPermission(userRole, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;