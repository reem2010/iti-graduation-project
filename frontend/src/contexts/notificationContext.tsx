'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { connectSocket } from '@/lib/socket';
import { notificationApi } from '@/lib/api';
import { toast } from 'sonner';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  fetchNotifications: () => Promise<void>;
  openNotification: Notification | null;
  setOpenNotification: (n: Notification | null) => void;
  markAllAsRead: () => void;
  deleteAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ userId, children }: { userId: number, children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotification, setOpenNotification] = useState<Notification | null>(null);
  const socketRef = useRef<any>(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(Array.isArray(data) ? data : data.notifications || []);
      setUnreadCount((Array.isArray(data) ? data : data.notifications || []).filter((n: Notification) => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const socket = connectSocket(userId);
    socketRef.current = socket;
    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [{ ...notification, isRead: false }, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast(notification.title, { description: notification.message });
    };
    socket.on('notification', handleNotification);
    socket.on('newNotification', handleNotification);
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const markAsRead = async (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await notificationApi.markAsRead(id);
    fetchNotifications();
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
    notificationApi.delete(id);
  };

  const markAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    fetchNotifications();
  };

  const deleteAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    notifications.forEach((n) => notificationApi.delete(n.id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, deleteNotification, fetchNotifications, openNotification, setOpenNotification, markAllAsRead, deleteAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}; 