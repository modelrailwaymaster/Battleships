import { useState } from "react";
import { useToast } from "../../components/Toast";
import { getGameSocket } from "../../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../../types/room";

interface HostLobbyProps {
  room: PublicRoomState;
}

function HostLobby({ room }: HostLobbyProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function emitHostAction(event: string, payload?: object) {
    const socket = getGameSocket();

    if (!socket?.connected) {
      showToast("Error", "Disconnected from the server.");
      return;
    }

    setLoading(true);

    socket.emit(event, payload, (response: ServerResponse) => {
      setLoading(false);

      if (!response.success) {
        showToast("Error", "Something went wrong: " + response.message);
      }
    });
  }

  function toggleLock() {
    emitHostAction("host:set-locked", {
      locked: !room.locked,
    });
  }

  function removePlayer(playerId: string) {
    emitHostAction("host:remove-player", { playerId });
  }

  function startPlacement() {
    emitHostAction("host:start-placement");
  }

  return (
    <div>
      <h1>Game lobby</h1>
      <p>You are hosting this game.</p>

      <section>
        <h2>Room code</h2>
        <h1>{room.code}</h1>
        <p>Share this code with your players.</p>
      </section>

      <section>
        <h2>Players ({room.players.length})</h2>

        {room.players.length === 0 ? (
          <p>Waiting for players to join...</p>
        ) : (
          <ul>
            {room.players.map((player) => (
              <li key={player.id}>
                {player.name}
                {player.ready ? " — Ready" : " — Not Ready"}
                {room.roomStage === "lobby" && (
                  <button
                    onClick={() => removePlayer(player.id)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
                {room.roomStage === "playing" &&
                  room.gameStage === "placement" &&
                  (player.shipsPlaced ? " — Placed" : " — Not Placed")}
              </li>
            ))}
          </ul>
        )}
      </section>

      {room.roomStage === "lobby" && (
        <section>
          <button onClick={toggleLock} disabled={loading}>
            {room.locked ? "Unlock lobby" : "Lock lobby"}
          </button>

          <button
            onClick={startPlacement}
            disabled={loading || room.players.length < 2}
          >
            Start ship placement
          </button>
        </section>
      )}
    </div>
  );
}

export default HostLobby;
