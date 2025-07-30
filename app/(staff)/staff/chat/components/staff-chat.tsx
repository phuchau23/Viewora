"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  HubConnectionBuilder,
  type HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Users, MessageCircle, Clock, LogOut } from "lucide-react";
import { cn } from "@/utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Customer {
  userId: string;
  name: string;
}

interface Message {
  senderName: string;
  content: string;
  sentTime: string;
  senderId: string;
  type?: "system" | "user";
}

interface StaffChatProps {
  staffId: string | null;
  staffName: string;
}

export default function StaffChat({ staffId, staffName }: StaffChatProps) {
  const router = useRouter();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7014/chatHub?role=Employee&userId=${staffId}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, [staffId]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");
          setIsConnected(true);

          // Listen for customer list
          connection.on("AllCustomersChatted", (customerList: Customer[]) => {
            console.log("Received customer list:", customerList);
            setCustomers(customerList);
          });

          // Listen for incoming messages
          connection.on(
            "Receive",
            (
              senderName: string,
              content: string,
              sentTime: string,
              senderId: string
            ) => {
              const message: Message = {
                senderName,
                content,
                sentTime,
                senderId,
                type: senderId === "system" ? "system" : "user",
              };
              setMessages((prev) => [...prev, message]);
            }
          );

          // Listen for errors
          connection.on("Error", (errorMessage: string) => {
            console.error("SignalR Error:", errorMessage);
          });
        })
        .catch((err) => {
          console.error("Error connecting to SignalR:", err);
          setIsConnected(false);
        });

      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  const handleCustomerSelect = async (customer: Customer) => {
    if (!connection || !isConnected) return;

    setIsLoading(true);
    setSelectedCustomer(customer);
    setMessages([]); // Clear current messages

    try {
      // Switch to the selected customer's room
      await connection.invoke("SwitchCustomerRoom", customer.userId);
    } catch (err) {
      console.error("Error switching customer room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!connection || !isConnected || !selectedCustomer || !newMessage.trim())
      return;

    try {
      await connection.invoke(
        "SendMessageToCustomerAsync",
        selectedCustomer.userId,
        newMessage.trim()
      );
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  function getInitials(name: string): string {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);
    const lastWord = words[words.length - 1] || "";
    return lastWord[0]?.toUpperCase() || "";
  }

  const handleLogout = () => {
    Cookies.remove("auth-token");
    setToken(null);
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Customer List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-orange-500 text-white">
                {getInitials(staffName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{staffName}</h2>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500" : "bg-red-500"
                  )}
                />
                <span className="text-sm text-gray-500">
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              <span>Customers ({customers.length})</span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {customers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No customer conversations yet</p>
              </div>
            ) : (
              <div className="p-2">
                {customers.map((customer) => (
                  <div
                    key={customer.userId}
                    onClick={() => handleCustomerSelect(customer)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      "hover:bg-gray-50",
                      selectedCustomer?.userId === customer.userId
                        ? "bg-orange-50 border border-orange-200"
                        : "border border-transparent"
                    )}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Customer ID: {customer.userId}
                      </p>
                    </div>
                    {selectedCustomer?.userId === customer.userId && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {getInitials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-sm text-gray-500">Customer Support Chat</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.senderId === staffId
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      {message.senderId !== staffId &&
                        message.type !== "system" && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                              {getInitials(message.senderName)}
                            </AvatarFallback>
                          </Avatar>
                        )}

                      <div
                        className={cn(
                          "max-w-xs lg:max-w-md",
                          message.type === "system"
                            ? "w-full flex justify-center"
                            : ""
                        )}
                      >
                        {message.type === "system" ? (
                          <div className="bg-gray-100 text-gray-600 text-sm px-3 py-2 rounded-full">
                            {message.content}
                          </div>
                        ) : (
                          <Card
                            className={cn(
                              "p-3",
                              message.senderId === staffId
                                ? "bg-orange-400 text-white"
                                : "bg-white border-gray-200"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div
                              className={cn(
                                "flex items-center gap-1 mt-1 text-xs",
                                message.senderId === staffId
                                  ? "text-white"
                                  : "text-gray-500"
                              )}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(message.sentTime)}</span>
                            </div>
                          </Card>
                        )}
                      </div>

                      {message.senderId === staffId && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-orange-500 text-white text-xs">
                            {getInitials(staffName)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2 items-center">
                {/* Auto reply message trigger */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="w-5 h-5 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-1/3 p-2">
                    <div className="text-sm font-semibold mb-2">
                      Quick Replies
                    </div>
                    <div className="space-y-2">
                      {[
                        "Chào bạn, mình có thể hỗ trợ gì trong việc đặt vé ạ?",
                        "Bạn vui lòng cung cấp thêm thông tin nhé.",
                        "Cho mình xin thông tin đặt vé cụ thể của bạn để có thể hỗ trợ bạn tốt hơn ạ",
                        "Cảm ơn bạn đã đặt vé tại rạp của chúng tôi! Viewora rất hân hạnh được phục vụ bạn",
                      ].map((quickReply, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => setNewMessage(quickReply)}
                        >
                          {quickReply}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={!isConnected}
                  className="flex-1"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!isConnected || !newMessage.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Customer Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a customer to start chatting
              </h3>
              <p className="text-gray-500">
                Choose a customer from the sidebar to view conversation history
                and send messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
