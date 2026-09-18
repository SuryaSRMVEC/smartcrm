import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";
import Contacts from "./pages/Contacts";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";
import TeamMembers from "./pages/TeamMembers";
import Settings from "./pages/Settings";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>

  {/* Public Home */}
  <Route path="/" element={<Home />} />

  {/* Public authentication pages */}
  <Route element={<PublicRoute />}>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Route>

  {/* If /home is typed manually */}
  <Route
    path="/home"
    element={
      localStorage.getItem("isLoggedIn") === "true"
        ? <Navigate to="/dashboard" replace />
        : <Home />
    }
  />

  {/* Protected CRM */}
<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    
    <Route element={<RoleProtectedRoute permission="dashboard" />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>

    <Route element={<RoleProtectedRoute permission="customers" />}>
      <Route path="/customers" element={<Customers />} />
    </Route>

    <Route element={<RoleProtectedRoute permission="leads" />}>
      <Route path="/leads" element={<Leads />} />
    </Route>

    <Route element={<RoleProtectedRoute permission="deals" />}>
      <Route path="/deals" element={<Deals />} />
    </Route>

    <Route element={<RoleProtectedRoute permission="contacts" />}>
      <Route path="/contacts" element={<Contacts />} />
    </Route>

    <Route element={<RoleProtectedRoute permission="tasks" />}>
      <Route path="/tasks" element={<Tasks />} />
    </Route>

    <Route element={<RoleProtectedRoute permission="reports" />}>
      <Route path="/reports" element={<Reports />} />
    </Route>

    <Route element={<RoleProtectedRoute permission="team-members" />}>
      <Route path="/team-members" element={<TeamMembers />} />
    </Route>
    
    <Route element={<RoleProtectedRoute permission="settings" />}>
      <Route path="/settings" element={<Settings />} />
    </Route>

  </Route>
</Route>

</Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
