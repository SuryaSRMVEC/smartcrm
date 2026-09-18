import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { UserPlus, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import bgImage from "../assets/bg-img.png";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+={}[\]:;"'<>,.?/\\|~`-]).{8,}$/;

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    return <Navigate to="/" replace />;
  }

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (!val) {
      setPasswordError("");
    } else if (!PASSWORD_REGEX.test(val)) {
      setPasswordError(
        "Min 8 chars with 1 uppercase, 1 lowercase, 1 number & 1 special character.",
      );
    } else {
      setPasswordError("");
    }

    if (confirmPassword && val !== confirmPassword) {
      setConfirmError("Passwords do not match.");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val);
    if (!val) {
      setConfirmError("");
    } else if (val !== password) {
      setConfirmError("Passwords do not match.");
    } else {
      setConfirmError("");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("crmUsers") || "[]");
    const userExists = users.some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase(),
    );

    if (userExists) {
      alert("An account with this email already exists. Please login.");
      navigate("/login");
      return;
    }

    const role = users.length === 0 ? "Admin" : "Sales";

    users.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });

    localStorage.setItem("crmUsers", JSON.stringify(users));

    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed relative selection:bg-blue-500 selection:text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-800 bg-white/90 hover:bg-white backdrop-blur-md border border-white/60 shadow-md hover:shadow-lg transition-all duration-200 group hover:-translate-x-0.5"
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

      <div className="relative z-10 w-full max-w-sm sm:max-w-md my-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl mb-3 shadow-lg shadow-blue-600/30 ring-4 ring-white/30">
            <UserPlus className="text-white" size={24} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium drop-shadow-sm">
            Join us today and get started with your CRM
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8 transition-all">
          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full text-sm bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 sm:py-3 outline-none transition focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white text-slate-800 placeholder-slate-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full text-sm bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 sm:py-3 outline-none transition focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white text-slate-800 placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Create a strong password"
                  className={`w-full text-sm bg-slate-50/70 border rounded-xl pl-10 pr-10 py-2.5 sm:py-3 outline-none transition text-slate-800 placeholder-slate-400 focus:bg-white ${
                    passwordError
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[11px] sm:text-xs text-red-500 mt-1.5 font-medium leading-tight">
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full text-sm bg-slate-50/70 border rounded-xl pl-10 pr-10 py-2.5 sm:py-3 outline-none transition text-slate-800 placeholder-slate-400 focus:bg-white ${
                    confirmError
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {confirmError && (
                <p className="text-[11px] sm:text-xs text-red-500 mt-1.5 font-medium leading-tight">
                  {confirmError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline inline-block ml-0.5"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
