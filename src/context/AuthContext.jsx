import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });

  const login = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    setCurrentUser(null);
  };

  useEffect(() => {
    const syncAcrossTabs = (event) => {
      if (event.key === "currentUser") {
        try {
          setCurrentUser(
            event.newValue ? JSON.parse(event.newValue) : null
          );
        } catch {
          setCurrentUser(null);
        }
      }
    };

    window.addEventListener("storage", syncAcrossTabs);

    return () => {
      window.removeEventListener("storage", syncAcrossTabs);
    };
  }, []);

  const value = {
    currentUser,
    isLoggedIn: Boolean(currentUser),
    role: currentUser?.role || null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};