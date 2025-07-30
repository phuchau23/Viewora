"use client";
import { useEffect, useState } from "react";
import type React from "react";

import * as signalR from "@microsoft/signalr";
import { getUserIdFromToken } from "@/utils/signalr";
import { Send, X, MessageCircle, User } from "lucide-react";
import { useUserProfile } from "@/hooks/useUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  sender: string;
  content: string;
  time: string;
  fromUserId: string;
}

export default function ChatPopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const userId = getUserIdFromToken();

  // Tạo userId nếu chưa có
  function generateCustomerId() {
    const saved = localStorage.getItem("chat-user-id");
    if (saved) return saved;
    const id = crypto.randomUUID();
    localStorage.setItem("chat-user-id", id);
    return id;
  }

  const customerId = userId || generateCustomerId();

  // const customerName = useUserProfile().data?.data?.fullName;

  // Kết nối SignalR
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(
        `${process.env.NEXT_PUBLIC_SIGNALR_CHAT}/chatHub?userId=${customerId}&role=Customer`
      )
      .withAutomaticReconnect()
      .build();

    conn.on(
      "Receive",
      (sender: string, content: string, time: string, fromUserId: string) => {
        setMessages((prev) => [...prev, { sender, content, time, fromUserId }]);
      }
    );

    conn.on("ReceiveChatHistory", (chatHistory: ChatMessage[]) => {
      setMessages(chatHistory);
    });

    conn.onreconnected(() => setIsConnected(true));
    conn.onreconnecting(() => setIsConnected(false));
    conn.onclose(() => setIsConnected(false));

    conn
      .start()
      .then(() => {
        conn.invoke("SendChatHistory", customerId);
        setConnection(conn);
        setIsConnected(true);
      })
      .catch(console.error);

    return () => {
      conn.stop();
    };
  }, [customerId]);

  const handleSend = async () => {
    if (!message.trim() || !connection) return;
    await connection.invoke("SendMessageAsync", message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function getInitials(name: string): string {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);
    const lastWord = words[words.length - 1] || "";
    return lastWord[0]?.toUpperCase() || "";
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Hỗ trợ khách hàng</h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              {isConnected ? "Đang kết nối" : "Mất kết nối"}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Chào mừng bạn đến với hỗ trợ khách hàng!</p>
            <p className="text-xs mt-1">
              Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện
            </p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isOwnMessage = m.fromUserId === customerId;
            return (
              <div
                key={idx}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    isOwnMessage ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  {isOwnMessage ? (
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src="https://images.icon-icons.com/1161/PNG/512/1487716857-user_81635.png"
                        alt="Customer Avatar"
                      />
                    </Avatar>
                  ) : (
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"
                        alt="Customer Avatar"
                      />
                    </Avatar>
                  )}

                  {/* Message bubble */}
                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? "bg-orange-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      {!isOwnMessage && (
                        <div className="text-xs font-medium text-gray-600 mb-1">
                          {m.sender}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </div>
                    </div>
                    <div
                      className={`text-xs text-gray-400 mt-1 ${
                        isOwnMessage ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(m.time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Nhập tin nhắn của bạn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
              style={{
                minHeight: "44px",
                maxHeight: "100px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "44px";
                target.style.height = Math.min(target.scrollHeight, 100) + "px";
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim() || !isConnected}
            className="w-11 h-11 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {!isConnected && (
          <div className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            Đang kết nối lại...
          </div>
        )}
      </div>
    </div>
  );
}
