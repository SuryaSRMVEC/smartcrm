import {
  LayoutDashboard,
  Users,
  UserPlus,
  BriefcaseBusiness,
  ContactRound,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  UserRoundSearch,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/permissions";
import { useAuth } from "../context/useAuth";

const Sidebar = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userRole = currentUser?.role || "Sales";
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      permission: "dashboard",
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
      permission: "customers",
    },
    {
      name: "Leads",
      path: "/leads",
      icon: UserPlus,
      permission: "leads",
    },
    {
      name: "Deals",
      path: "/deals",
      icon: BriefcaseBusiness,
      permission: "deals",
    },
    {
      name: "Contacts",
      path: "/contacts",
      icon: ContactRound,
      permission: "contacts",
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
      permission: "tasks",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
      permission: "reports",
    },
    {
      name: "Team Members",
      path: "/team-members",
      icon: UserRoundSearch,
      permission: "team-members",
    },
  ];

  return (
    <aside className="relative z-20 w-16 md:w-64 min-h-screen bg-slate-900 text-white flex flex-col transition-all duration-300">
      <div className="px-3 md:px-6 py-4 md:py-5 border-b border-slate-700">
        <div className="flex items-center justify-center md:justify-between w-full">
          <h1 className="text-lg md:text-2xl font-bold tracking-tight">
            CRM<span className="text-blue-400">.</span>
          </h1>
          <ChevronDown size={20} className="hidden md:block text-slate-400" />
        </div>
        <p className="text-[10px] md:text-xs text-slate-400 mt-1 hidden md:block truncate">
          Customer Management
        </p>
      </div>
      <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto">
        {menuItems
          .filter((item) => hasPermission(userRole, item.permission))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={item.name}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                <span className="hidden md:inline truncate">{item.name}</span>
              </NavLink>
            );
          })}
      </nav>
      <div className="p-2 md:p-4 border-t border-slate-700 space-y-2">
        <NavLink
          to="/settings"
          className="w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition"
        >
          <Settings size={20} className="shrink-0" />
          <span className="hidden md:inline truncate">Settings</span>
        </NavLink>
        <button
          title="Logout"
          onClick={handleLogout}
          className="w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="hidden md:inline truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
