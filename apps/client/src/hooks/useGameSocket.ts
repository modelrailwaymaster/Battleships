import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getGameSocket(): Socket | null {
  return socket;
}

export function useGameSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const serverUrl = `http://${window.location.hostname}:3001`;
    const newSocket = io(serverUrl);

    socket = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to Battleships server:", newSocket.id);
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Battleships server");
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      setConnected(false);
    });

    return () => {
      newSocket.disconnect();

      if (socket === newSocket) {
        socket = null;
      }
    };
  }, []);

  return { connected };
}
