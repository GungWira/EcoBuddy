import { createContext, useContext, useState, ReactNode } from "react";
import Notification from "../components/Notification";

interface NotificationType {
  id: number;
  isExp: boolean;
  countExp?: number;
  text?: string;
}

interface NotificationContextType {
  addNotification: (isExp: boolean, text?: string, countExp?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (
    isExp: boolean,
    text?: string,
    countExp?: number
  ) => {
    const id = Date.now(); // ID unik
    setNotifications((prev) => [...prev, { id, isExp, text, countExp }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}

      {/* Notifikasi di global layout */}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-3 justify-end items-end">
        {notifications.map((notif, index) => (
          <Notification
            key={index + notif.id}
            id={notif.id}
            isExp={notif.isExp}
            countExp={notif.countExp}
            text={notif.text}
            onClose={(id) =>
              setNotifications((prev) => prev.filter((n) => n.id !== id))
            }
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
