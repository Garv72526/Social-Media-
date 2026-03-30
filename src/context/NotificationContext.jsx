// 🔔 NEW FILE: NotificationContext.jsx
// This file manages notifications globally across the whole app.
// Any component can add a notification or read them.
// Works exactly like AuthContext — wrap your app in it, use it anywhere.

import { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  // notifications is an array of objects like: { text: "You followed john" }
  const [notifications, setNotifications] = useState([]);

  // 🔔 Call this from anywhere to add a new notification
  const addNotification = (notif) => {
    setNotifications((prev) => [...prev, notif]);
  };

  // 🔔 Call this when user opens the bell — clears the list
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
