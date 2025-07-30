// utils/chatbox.ts
import { useState, useEffect, useRef } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import { getUserIdFromToken } from "./signalr";

interface SignalRConnectionProps {
  role: "Customer" | "Employee";
  onMessageReceived?: (sender: string, content: string, timestamp: Date) => void;
  onError?: (message: string) => void;
  onSystemMessage?: (message: string) => void;
}

export function useSignalRConnection({
  role,
  onMessageReceived,
  onError,
  onSystemMessage,
}: SignalRConnectionProps) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      onError?.("Không tìm thấy userId trong token.");
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7014/chatHub?userId=${userId}&role=${role}`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (ctx) =>
          ctx.previousRetryCount < maxReconnectAttempts
            ? 1000 * Math.pow(2, ctx.previousRetryCount)
            : null,
      })
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.on("ReceiveMessage", (sender: string, content: string, timestamp: string) => {
      const parsedTimestamp = new Date(timestamp);
      onMessageReceived?.(sender, content, parsedTimestamp);
      setMessages((prev) => [...prev, { sender, content, timestamp: parsedTimestamp }]);
    });

    newConnection.on("ReceiveSystemMessage", (message: string) => {
      onSystemMessage?.(message);
    });

    newConnection
      .start()
      .then(() => {
        setConnection(newConnection);
        setIsConnected(true);
      })
      .catch((err) => {
        console.error("SignalR start error:", err);
        onError?.("Kết nối SignalR thất bại.");
      });

    return () => {
      newConnection.stop();
    };
  }, [userId, role]);

  const sendMessage = async (content: string) => {
    if (connection && isConnected) {
      await connection.invoke("SendMessage", content);
    }
  };

  const endChat = async () => {
    if (connection && isConnected) {
      await connection.invoke("EndChat");
    }
  };

  const requestChatHistory = async () => {
    if (connection && isConnected) {
      await connection.invoke("RequestChatHistory");
    }
  };

  return {
    connection,
    isConnected,
    messages,
    sendMessage,
    endChat,
    requestChatHistory,
  };
}
