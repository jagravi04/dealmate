
import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "@/types";
import { mockNotifications } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Load initial notifications
  useEffect(() => {
    if (user) {
      // In a real app, you would fetch notifications from your API
      setNotifications(mockNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
