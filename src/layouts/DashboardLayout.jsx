import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
  <div className="min-h-screen bg-gray-100 flex flex-row">
    <Sidebar />
    <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default DashboardLayout;