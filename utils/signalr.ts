import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

export interface HeldSeat {
  seatId: string;
  heldBy: string;
}

export function getTokenFromCookie(): string {
  return Cookies.get("auth-token") || "";
}

export function getUserIdFromToken(): string | null {
  try {
    const token = getTokenFromCookie();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.nameid || null;
  } catch {
    return null;
  }
}

export function useSeatSignalR(
  showTimeId: string,
  onSeatsHeld: (seatInfos: HeldSeat[]) => void,
  onSeatsReleased: (seatIds: string[], releasedBy: string) => void
) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!showTimeId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_SIGNALR_HOLDSEAT + "/hub/cinema", {
        accessTokenFactory: getTokenFromCookie,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        connection.on(
          "CurrentHeldSeats",
          (receivedShowTimeId: string, seatInfos: HeldSeat[]) => {
            if (receivedShowTimeId === showTimeId) {
              console.log("📥 CurrentHeldSeats:", seatInfos);
              onSeatsHeld(seatInfos); // ✅ Dùng chung handler
            }
          }
        );

        connection.on(
          "SeatsHeld",
          (receivedShowTimeId: string, seatInfos: HeldSeat[]) => {
            if (receivedShowTimeId === showTimeId) {
              console.log("🪑 SeatsHeld:", seatInfos); // ✅ in log ở B
              onSeatsHeld(seatInfos);
            }
          }
        );

        connection.on(
          "SeatReleased",
          (receivedShowTimeId: string, seatId: string, releasedBy: string) => {
            if (receivedShowTimeId === showTimeId) {
              console.log("🎟 SeatReleased:", seatId, "by", releasedBy);
              onSeatsReleased([seatId], releasedBy);
            }
          }
        );

        connection.on("JoinedGroup", (receivedShowTimeId: string) => {
          console.log(
            "✅ JoinedGroup confirmed from server:",
            receivedShowTimeId
          );
        });

        await connection.start();
        console.log("✅ SignalR connected");
        setIsConnected(true);

        await connection.invoke("JoinGroup", showTimeId);
        console.log("📡 JoinGroup invoked:", showTimeId);
      } catch (err) {
        console.error("❌ SignalR connection failed", err);
        setIsConnected(false);
        setTimeout(startConnection, 3000);
      }
    };

    startConnection();

    return () => {
      if (
        connectionRef.current &&
        connectionRef.current.state === signalR.HubConnectionState.Connected
      ) {
        connectionRef.current
          .invoke("LeaveGroup", showTimeId)
          .catch((e) => console.warn("⚠️ LeaveGroup error:", e));
      }
      connectionRef.current?.stop();
    };
  }, [showTimeId]);

  const holdSeats = (seatIds: string[]) => {
    if (isConnected && connectionRef.current) {
      console.log("📨 Holding seats:", seatIds);
      connectionRef.current.invoke("HoldSeats", showTimeId, seatIds);
    } else {
      console.warn("⛔ Cannot hold seats - not connected yet", {
        state: connectionRef.current?.state,
        isConnected,
      });
    }
  };

  const releaseSeat = (seatId: string) => {
    if (isConnected && connectionRef.current) {
      console.log("📤 Releasing seat:", seatId);
      connectionRef.current.invoke("ReleaseSeat", showTimeId, seatId);
    } else {
      console.warn("⛔ Cannot release seat - not connected yet", {
        state: connectionRef.current?.state,
        isConnected,
      });
    }
  };

  return { holdSeats, releaseSeat };
}
