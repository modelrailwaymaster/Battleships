import { useEffect, useState } from "react";
import { getGameSocket, useGameSocket } from "./hooks/useGameSocket";

import HostLobby from "./screens/HostLobby";
import HostSetup from "./screens/HostSetup";
import JoinGame from "./screens/JoinGame";
import MainMenu from "./screens/MainMenu";
import PlayerLobby from "./screens/playerLobby";

import type { PublicRoomState } from "./types/room";

type Screen = "menu" | "host-setup" | "join-game" | "room";
type RoomRole = "host" | "player";

function App() {
  const { connected } = useGameSocket();

  const [screen, setScreen] = useState<Screen>("menu");
  const [room, setRoom] = useState<PublicRoomState | null>(null);
  const [role, setRole] = useState<RoomRole>("player");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!connected || !room) return;

    const socket = getGameSocket();
    if (!socket) return;

    function handleRoomUpdated(updatedRoom: PublicRoomState) {
      setRoom(updatedRoom);
    }

    function handleRoomClosed(data: { message: string }) {
      setNotice(data.message);
      setRoom(null);
      setScreen("menu");
    }

    function handlePlayerRemoved(data: { message: string }) {
      setNotice(data.message);
      setRoom(null);
      setScreen("menu");
    }

    socket.on("room:updated", handleRoomUpdated);
    socket.on("room:closed", handleRoomClosed);
    socket.on("player:removed", handlePlayerRemoved);

    return () => {
      socket.off("room:updated", handleRoomUpdated);
      socket.off("room:closed", handleRoomClosed);
      socket.off("player:removed", handlePlayerRemoved);
    };
  }, [connected, room?.code]);

  function handleRoomCreated(newRoom: PublicRoomState) {
    setNotice("");
    setRoom(newRoom);
    setRole("host");
    setScreen("room");
  }

  function handleRoomJoined(newRoom: PublicRoomState) {
    setNotice("");
    setRoom(newRoom);
    setRole("player");
    setScreen("room");
  }

  return (
    <div className="app">
      <header>
        <span>Battleships</span>
        <span>{connected ? "Connected" : "Disconnected"}</span>
      </header>

      {notice && (
        <p role="alert">
          {notice}
          <button onClick={() => setNotice("")}>Dismiss</button>
        </p>
      )}

      {screen === "menu" && (
        <MainMenu
          onHost={() => setScreen("host-setup")}
          onJoin={() => setScreen("join-game")}
        />
      )}

      {screen === "host-setup" && (
        <HostSetup
          onCreated={handleRoomCreated}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "join-game" && (
        <JoinGame
          onJoined={handleRoomJoined}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "room" &&
        room &&
        (role === "host" ? (
          <HostLobby room={room} />
        ) : (
          <PlayerLobby room={room} />
        ))}
    </div>
  );
}

export default App;
