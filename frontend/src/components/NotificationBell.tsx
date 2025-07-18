import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useNotification } from '@/contexts/notificationContext';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    openNotification,
    setOpenNotification,
  } = useNotification();

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => !n.isRead && markAsRead(n.id));
  };

  const handleDeleteAll = () => {
    notifications.forEach(n => deleteNotification(n.id));
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative cursor-pointer p-2 rounded-full hover:bg-emerald-50 transition">
            <Bell size={20}  color="#059669" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                {unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[420px] max-h-[520px] overflow-y-auto rounded-xl shadow-2xl border border-emerald-100 bg-white p-0">
          <div className="flex justify-between items-center mb-2 px-4 pt-4">
            <span className="font-bold text-emerald-900 text-lg">Notifications</span>
            <div className="flex gap-2">
              <button
                className="p-1 rounded hover:bg-emerald-100 transition cursor-pointer"
                title="Mark all as read"
                onClick={handleMarkAllAsRead}
              >
                <svg width="20" height="20" fill="none"><path d="M5 10l4 4 6-8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                className="p-1 rounded hover:bg-red-100 transition cursor-pointer"
                title="Delete all"
                onClick={handleDeleteAll}
              >
                <svg width="20" height="20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
          {notifications.length === 0 && (
            <div className="text-gray-400 text-center py-8">No notifications</div>
          )}
          <div className="flex flex-col gap-1 px-2 pb-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-2 p-4 rounded-lg cursor-pointer transition hover:bg-emerald-50 ${!n.isRead ? 'bg-emerald-50 font-semibold' : 'bg-white'}`}
                onClick={() => {
                  markAsRead(n.id);
                  setOpenNotification(n);
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 text-base">{n.title}</span>
                    {!n.isRead && <Badge variant="secondary">New</Badge>}
                  </div>
                  <div className="text-gray-600 text-sm truncate max-w-xs">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <button
                  className="ml-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                  onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                  title="Delete notification"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <AlertDialog open={!!openNotification} onOpenChange={() => setOpenNotification(null)}>
        <AlertDialogContent>
          <AlertDialogTitle className="text-emerald-800 text-lg">{openNotification?.title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 text-base whitespace-pre-line">
            {openNotification?.message}
          </AlertDialogDescription>
          <div className="text-xs text-gray-400 mt-2">{openNotification && new Date(openNotification.createdAt).toLocaleString()}</div>
          <button
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
            onClick={() => setOpenNotification(null)}
          >
            Close
          </button>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotificationBell; 