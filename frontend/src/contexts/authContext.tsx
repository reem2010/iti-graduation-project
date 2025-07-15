"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authApi, messagesApi } from "@/lib/api";
import type { User } from "@/types/index";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await authApi.getUser();
  //       if (res && res.id) {
  //         setUser(res);
  //       } else {
  //         setUser(null);
  //       }
  //     } catch (err) {
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const unreadMessagesCount = async () => {
  //     try {
  //       const count = await messagesApi.getUnreadCount();
  //       setUnreadCount(Number(count));
  //       setUser((prev) => prev ? { ...prev, unreadMessagesCount: Number(count) } : prev);
  //     } catch (error) {
  //       console.error("Error fetching unread messages:", error);
  //     }
  //   };

  //   fetchUser();
  //   unreadMessagesCount();
  // }, []);

  useEffect(() => {
    const fetchUserAndUnread = async () => {
      try {
        const res = await authApi.getUser();
        if (res && res.id) {
          setUser(res);
        } else {
          setUser(null);
        }

        const count = await messagesApi.getUnreadCount();
        setUnreadCount(+count);
      } catch (err) {
        setUser(null);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndUnread();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, unreadCount, setUnreadCount }}
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
