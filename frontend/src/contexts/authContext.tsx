"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authApi, messagesApi } from "@/lib/api";
import type { User } from "@/types/index";
import { connectSocket } from "@/lib/socket";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<any>(null);

  const refreshUnreadCount = async () => {
    try {
      const count = await messagesApi.getUnreadCount();
      setUnreadCount(Number(count));
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  useEffect(() => {
    const fetchUserAndUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await authApi.getUser();
        if (res && res.id) {
          setUser(res);
        } else {
          setUser(null);
        }

        await refreshUnreadCount();
      } catch (err) {
        setUser(null);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndUnread();
  }, []);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket(user.id);
    socketRef.current = socket;

    socket.on("newMessage", async (message: any) => {
      await refreshUnreadCount();
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, unreadCount, refreshUnreadCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
