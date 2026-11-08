import { useCallback, useEffect, useState } from "react";
import { useToast } from "./components/Toast";
import { getGameSocket, useGameSocket } from "./hooks/useGameSocket";

import GameScreen from "./screens/game/GameScreen";
import HostSetup from "./screens/HostSetup";
import MainMenu from "./screens/menu/HostSetu";
import HostLobby from "./screens/menu/MainMenustLobby";
import PlayerLobby from "./screens/menu/PlayerLobby";
import PlayerSetup from "./screens/menu/PlayerSetup";

import type { PublicRoomState, RoomRole } from "./types/room";

function App() {
  const { connected } = useGameSocket();
  const { showToast } = useToast();

  const [role, setRole] = useState<RoomRole>("unknown");
  const [room, setRoom] = useState<PublicRoomState | null>(null);

  function becomeHost() {
    setRole("host");
    setRoom(null);
    showToast("Role Changed", "You became the host.");
  }

  function becomePlayer() {
    setRole("player");
    setRoom(null);
    showToast("Role Changed", "You became a player.");
  }

  const returnToMenu = useCallback(() => {
    setRole("unknown");
    setRoom(null);
    showToast("Role Changed", "Role Removed.");
  }, [showToast]);

  useEffect(() => {
    if (!connected || !room) return;

    const socket = getGameSocket();
    if (!socket) return;

    function handleRoomUpdated(updatedRoom: PublicRoomState) {
      setRoom(updatedRoom);
    }

    function handleRoomClosed(data: { message: string }) {
      showToast("Room Closed", data.message);
      returnToMenu();
    }

    function handlePlayerRemoved(data: { message: string }) {
      showToast("Player Removed", data.message);
      returnToMenu();
    }

    socket.on("room:updated", handleRoomUpdated);
    socket.on("room:closed", handleRoomClosed);
    socket.on("player:removed", handlePlayerRemoved);

    return () => {
      socket.off("room:updated", handleRoomUpdated);
      socket.off("room:closed", handleRoomClosed);
      socket.off("player:removed", handlePlayerRemoved);
    };
  }, [connected, room, returnToMenu, showToast]);

  return (
    <main className="app">
      {role === "unknown" && (
        <MainMenu onHost={becomeHost} onJoin={becomePlayer} />
      )}

      {role === "host" &&
        (room ? (
          room.roomStage === "playing" ? (
            <GameScreen room={room} role="host" />
          ) : (
            <HostLobby room={room} />
          )
        ) : (
          <HostSetup onCreated={setRoom} onBack={returnToMenu} />
        ))}

      {role === "player" &&
        (room ? (
          room.roomStage === "playing" ? (
            <GameScreen room={room} role="player" />
          ) : (
            <PlayerLobby room={room} />
          )
        ) : (
          <PlayerSetup onJoined={setRoom} onBack={returnToMenu} />
        ))}
    </main>
  );
}

export default App;
