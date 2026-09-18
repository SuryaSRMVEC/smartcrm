import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Lock,
  Bell,
  LogOut,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserItem, setUserItem } from "../utils/userStorage";

const Settings = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const [name, setName] = useState(currentUser?.name || "");
  const [email] = useState(currentUser?.email || "");
  const [role] = useState(currentUser?.role || "Sales");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const savedSettings = getUserItem("crmSettings", {
    emailNotifications: true,
  });

  const [emailNotifications, setEmailNotifications] = useState(
    savedSettings.emailNotifications,
  );

  const handleProfileSave = () => {
    const updatedUser = {
      ...currentUser,
      name: name.trim(),
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("crmUsers") || "[]");

    const updatedUsers = users.map((user) =>
      user.email?.trim().toLowerCase() === email.trim().toLowerCase()
        ? {
            ...user,
            name: name.trim(),
          }
        : user,
    );

    localStorage.setItem("crmUsers", JSON.stringify(updatedUsers));

    window.dispatchEvent(new Event("crmUserUpdated"));

    alert("Profile updated successfully.");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("crmUsers") || "[]");

    const userIndex = users.findIndex(
      (user) => user.email?.trim().toLowerCase() === email.trim().toLowerCase(),
    );

    if (userIndex === -1) {
      alert("User account not found.");
      return;
    }

    if (users[userIndex].password !== passwordData.currentPassword) {
      alert("Current password is incorrect.");
      return;
    }

    users[userIndex].password = passwordData.newPassword;

    localStorage.setItem("crmUsers", JSON.stringify(users));

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    alert("Password changed successfully.");
  };

  const handleNotificationSave = () => {
    setUserItem("crmSettings", {
      emailNotifications,
    });

    alert("Notification preferences saved.");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    window.dispatchEvent(new Event("crmUserUpdated"));

    navigate("/login", { replace: true });
  };

  return (
<div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-6 lg:space-y-8">

      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
          Manage your profile, security and preferences.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <User size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Profile
              </h2>
              <p className="text-xs text-slate-500">
                Update your personal information
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 bg-slate-50/80 text-slate-500 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Role
              </label>
              <div className="relative">
                <Shield
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={role}
                  disabled
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 bg-slate-50/80 text-slate-500 rounded-lg cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-1 sm:pt-2">
            <button
              type="button"
              onClick={handleProfileSave}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition"
            >
              <Save size={16} />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Lock size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Security
              </h2>
              <p className="text-xs text-slate-500">
                Change your account password
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 pr-10 text-xs sm:text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 pr-10 text-xs sm:text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 pr-10 text-xs sm:text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-1 sm:pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition"
            >
              <Lock size={16} />
              <span>Change Password</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Bell size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Notifications
              </h2>
              <p className="text-xs text-slate-500">
                Manage your notification preferences
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-900">
                Email Notifications
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive email alerts about updates, leads, and CRM activity
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={emailNotifications}
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                emailNotifications ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  emailNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleNotificationSave}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition"
            >
              <Save size={16} />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-200/80 shadow-xs p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              Account Session
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign out of your active CRM dashboard session on this device
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
