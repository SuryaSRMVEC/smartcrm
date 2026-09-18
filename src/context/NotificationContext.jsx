import { createContext, useState, useEffect, useCallback } from "react";

import {
  getUserItem,
  setUserItem,
  getCurrentUserEmail,
} from "../utils/userStorage";

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() =>
    getUserItem("crmNotifications", [])
  );

  const loadNotifications = useCallback(() => {
    const userEmail = getCurrentUserEmail();

    if (!userEmail) {
      setNotifications([]);
      return;
    }

    setNotifications(
      getUserItem("crmNotifications", [])
    );
  }, []);

  // Detect login/user changes
  useEffect(() => {
    const handleUserChange = () => {
      loadNotifications();
    };

    window.addEventListener(
      "crmUserUpdated",
      handleUserChange
    );

    window.addEventListener(
      "storage",
      handleUserChange
    );

    window.addEventListener(
      "focus",
      handleUserChange
    );

    return () => {
      window.removeEventListener(
        "crmUserUpdated",
        handleUserChange
      );

      window.removeEventListener(
        "storage",
        handleUserChange
      );

      window.removeEventListener(
        "focus",
        handleUserChange
      );
    };
  }, [loadNotifications]);

  // Save notifications for the currently logged-in user
  useEffect(() => {
    const userEmail = getCurrentUserEmail();

    if (!userEmail) {
      return;
    }

    setUserItem(
      "crmNotifications",
      notifications
    );
  }, [notifications]);

  const addNotification = (type, action, title) => {
    const newEntry = {
      id: Date.now(),
      type,
      action,
      title,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      read: false,
    };

    setNotifications((prev) => [
      newEntry,
      ...prev.slice(0, 24),
    ]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};