import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import bgImage from "../assets/bg-img.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?\\|`~]).{8,}$/;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const handlePasswordChange = (value) => {
    setPassword(value);
    setFormError("");

    if (!value) {
      setPasswordError("");
      return;
    }

    if (!PASSWORD_REGEX.test(value)) {
      setPasswordError(
        "Min 8 chars, with at least 1 uppercase, 1 lowercase, 1 number, & 1 special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setFormError("");

    // Validate password
    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    setPasswordError("");

    // Get registered users
    const users = JSON.parse(
      localStorage.getItem("crmUsers") || "[]"
    );

    if (!Array.isArray(users) || users.length === 0) {
      setFormError("No account found. Please sign up first.");
      return;
    }

    // Find matching user
    const matchedUser = users.find(
      (user) =>
        user.email?.trim().toLowerCase() ===
          email.trim().toLowerCase() &&
        user.password === password
    );

    // Invalid credentials
    if (!matchedUser) {
      setFormError("Invalid email or password.");
      return;
    }

    // Inactive account
    if (matchedUser.status === "Inactive") {
      setFormError(
        "Your account is inactive. Please contact an administrator."
      );
      return;
    }

    // Login through AuthContext
    login({
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    });

    // Navigate after successful authentication
    navigate("/dashboard", {
      replace: true,
    });
  };


  return (
<div
  className="h-dvh w-full overflow-hidden flex items-center justify-center px-4 py-4 sm:px-6 sm:py-5 bg-cover bg-center bg-no-repeat relative selection:bg-blue-500 selection:text-white"
  style={{
    backgroundImage: `url(${bgImage})`,
  }}
>
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />

  {/* Back to Home */}
  <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20">
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-800 bg-white/90 hover:bg-white backdrop-blur-md border border-white/60 shadow-md hover:shadow-lg transition-all duration-200 group hover:-translate-x-0.5"
    >
      <ArrowLeft
        size={16}
        className="text-slate-600 group-hover:text-blue-600 transition-colors"
      />

      <span className="group-hover:text-blue-600 transition-colors">
        Back to Home
      </span>
    </Link>
  </div>

  {/* Login Container */}
  <div className="relative z-10 w-full max-w-sm sm:max-w-md">

    {/* Header */}
    <div className="text-center mb-3 sm:mb-4">
      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl mb-2 shadow-lg shadow-blue-600/30 ring-2 ring-white/30">
        <LogIn className="text-white" size={22} />
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
        CRM Login
      </h1>

      <p className="text-[11px] sm:text-xs md:text-sm text-slate-200 mt-0.5 font-medium drop-shadow-sm">
        Sign in to access your CRM dashboard
      </p>
    </div>

    {/* Login Card */}
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/60 shadow-2xl p-4 sm:p-6 md:p-7">

      <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">

        {/* Error */}
        {formError && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-red-50/90 border border-red-200 text-[11px] sm:text-xs text-red-600 text-center font-medium leading-relaxed">
            {formError}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError("");
              }}
              placeholder="name@company.com"
              className="w-full text-sm bg-slate-50/70 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white text-slate-800 placeholder-slate-400"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              maxLength={15}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter your password"
              className={`w-full text-sm bg-slate-50/70 border rounded-xl pl-10 pr-10 py-2.5 outline-none transition text-slate-800 placeholder-slate-400 focus:bg-white ${
                passwordError
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              }`}
              required
            />

            <button
              type="button"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {passwordError && (
            <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 font-medium leading-tight">
              {passwordError}
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full mt-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-medium text-sm sm:text-base py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2"
        >
          Login
        </button>
      </form>

      {/* Signup */}
      <div className="text-center mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-200">
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline inline-block ml-0.5"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
</div>
  );
};

export default Login;