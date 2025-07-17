"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { Send, Paperclip, MoreVertical, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { connectSocket } from "@/lib/socket";
import { authApi, doctorProfileApi, messagesApi } from "@/lib/api";
import { useAuth } from "@/contexts/authContext";
import ClientParams from "@/components/chat/ClientParams";

// Interfaces
interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  createdAt: string;
  sender: {
    firstName: string;
    lastName: string;
  };
}

interface ChatSummary {
  userId: number;
  username: string;
  unreadCount: number;
  lastMessage: {
    content: string;
    createdAt: string;
  };
}

const SirajChat = () => {
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<ChatSummary[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSummary | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const { refreshUnreadCount } = useAuth();
  // Utility Functions
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const truncateMessage = (text: string, max = 40) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const selectChat = async (chat: ChatSummary) => {
    setSelectedChat(chat);
    setIsLoading(true);

    router.push(`/chat?with=${chat.userId}`);

    try {
      const res = await messagesApi.getConversation(
        currentUser?.id!,
        chat.userId
      );
      setMessages(res);

      await messagesApi.clearUnreadMessages(chat.userId);
      await refreshUnreadCount();
      setChatList((prev) => {
        const exists = prev.some((c) => c.userId === chat.userId);
        if (exists) {
          return prev.map((c) =>
            c.userId === chat.userId ? { ...c, unreadCount: 0 } : c
          );
        } else {
          // Add new chat to the list
          return [
            {
              userId: chat.userId,
              username: chat.username,
              unreadCount: 0,
              lastMessage:
                res.length > 0
                  ? {
                      content: res[res.length - 1].content,
                      createdAt: res[res.length - 1].createdAt,
                    }
                  : { content: "", createdAt: new Date().toISOString() },
            },
            ...prev,
          ];
        }
      });
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedChat || !currentUser) return;

    const newMsg = {
      content: currentMessage,
      senderId: currentUser.id,
      recipientId: selectedChat.userId,
    };

    try {
      console.log("Sending message:", newMsg);
      const sent = await messagesApi.createMessage(newMsg);
      console.log("Message sent:", sent);

      // Add message to current conversation
      setMessages((prev) => [...prev, sent]);

      // Update chat list with new message
      setChatList((prev) => {
        const index = prev.findIndex((c) => c.userId === selectedChat.userId);
        const updated = [...prev];

        if (index > -1) {
          updated[index] = {
            ...updated[index],
            lastMessage: {
              content: sent.content,
              createdAt: sent.createdAt,
            },
          };

          // Move to top of chat list
          const [updatedChat] = updated.splice(index, 1);
          updated.unshift(updatedChat);
        }

        return updated;
      });

      setCurrentMessage("");
    } catch (err) {
      console.error("Sending message failed:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const fetchChats = useCallback(async () => {
    try {
      const res = await messagesApi.getUserChats();
      setChatList(res);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize user and fetch chats
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authApi.getUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!selectedChatId || !currentUser || selectedChat) return;

    const id = parseInt(selectedChatId);
    const existingChat = chatList.find((c) => c.userId === id);

    if (existingChat) {
      selectChat(existingChat);
    } else {
      const fetchUser = async () => {
        try {
          const user = await authApi.getUserById(id);

          selectChat({
            userId: id,
            username: `${user.firstName} ${user.lastName}`,
            unreadCount: 0,
            lastMessage: {
              content: "",
              createdAt: "",
            },
          });
        } catch (err) {
          console.error("User not found", err);
        }
      };

      fetchUser();
    }
  }, [selectedChatId, chatList, selectedChat, currentUser]);

  // Socket connection and message handling
  useEffect(() => {
    if (!currentUser) return;

    const socket = connectSocket(currentUser.id);
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    console.log(isConnected);
    socket.on("newMessage", async (message: Message) => {
      console.log("Received message via WebSocket:", message);
      const fromUserId = message.senderId;
      const isSelected = selectedChat?.userId === fromUserId;

      await refreshUnreadCount();

      // Update chat list
      setChatList((prev) => {
        const index = prev.findIndex((c) => c.userId === fromUserId);
        const updated = [...prev];

        if (index > -1) {
          const chat = updated[index];
          updated[index] = {
            ...chat,
            lastMessage: {
              content: message.content,
              createdAt: message.createdAt,
            },
            unreadCount: isSelected ? 0 : chat.unreadCount + 1,
          };

          // Move to top of list
          const [updatedChat] = updated.splice(index, 1);
          updated.unshift(updatedChat);
        } else {
          // New chat
          updated.unshift({
            userId: fromUserId,
            username: `${message.sender.firstName} ${message.sender.lastName}`,
            unreadCount: isSelected ? 0 : 1,
            lastMessage: {
              content: message.content,
              createdAt: message.createdAt,
            },
          });
        }

        return updated;
      });

      // Add message to current conversation if it's selected
      if (isSelected) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      // socket.disconnect();
    };
  }, [currentUser, selectedChat]);

  return (
    <>
      <Suspense fallback={null}>
        <ClientParams onParams={setSelectedChatId} />
      </Suspense>

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Chat List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Chat</h1>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chatList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No conversations yet</p>
                <p className="text-sm">
                  Start a new conversation to get started
                </p>
              </div>
            ) : (
              chatList.map((chat) => (
                <div
                  key={chat.userId}
                  onClick={() => selectChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?.userId === chat.userId
                      ? "bg-emerald-50 border-r-4 border-r-emerald-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(chat.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.username}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {truncateMessage(chat.lastMessage.content)}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(selectedChat.username)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedChat.username}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isConnected ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === currentUser?.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl shadow-sm max-w-md ${
                            msg.senderId === currentUser?.id
                              ? "bg-emerald-500 text-white"
                              : "bg-white text-gray-800 "
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className="text-xs text-right mt-1 opacity-70">
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4 flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  ref={messageInputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selectedChat.username}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Siraj Chat
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Connect with licensed therapists and mental health
                  professionals through our secure, culturally-sensitive
                  platform.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SirajChat;
