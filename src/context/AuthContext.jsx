import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      return storedUser ? JSON.parse(storedUser) : null;
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
          const user = event.newValue
            ? JSON.parse(event.newValue)
            : null;

          setCurrentUser(user);
        } catch {
          setCurrentUser(null);
        }
      }

      if (event.key === "isLoggedIn" && event.newValue === null) {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", syncAcrossTabs);

    return () => {
      window.removeEventListener("storage", syncAcrossTabs);
    };
  }, []);

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
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