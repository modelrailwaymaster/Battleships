import { useState } from "react";
import { getGameSocket } from "../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../types/room";

interface HostLobbyProps {
  room: PublicRoomState;
}

function HostLobby({ room }: HostLobbyProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function emitHostAction(event: string, payload?: object) {
    const socket = getGameSocket();

    if (!socket?.connected) {
      setError("Disconnected from the server.");
      return;
    }

    setLoading(true);
    setError("");

    socket.emit(event, payload, (response: ServerResponse) => {
      setLoading(false);

      if (!response.success) {
        setError(response.message ?? "Something went wrong.");
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
    <main>
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
                {room.stage === "placement" && (
                  <span>{player.ready ? " — Ready" : " — Not ready"}</span>
                )}

                {room.stage === "lobby" && (
                  <button
                    onClick={() => removePlayer(player.id)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && <p role="alert">{error}</p>}

      {room.stage === "lobby" && (
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

      {room.stage === "placement" && (
        <section>
          <h2>Ship placement</h2>
          <p>Waiting for players to finish placing their ships.</p>
          <p>
            Ready: {room.players.filter((p) => p.ready).length}
            {" / "}
            {room.players.length}
          </p>
        </section>
      )}
    </main>
  );
}

export default HostLobby;
