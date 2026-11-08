import { useState } from "react";
import { getGameSocket } from "../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../types/room";

interface PlayerLobbyProps {
  room: PublicRoomState;
}

function PlayerLobby({ room }: PlayerLobbyProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const socket = getGameSocket();

  const currentPlayer = room.players.find((player) => player.id === socket?.id);

  function toggleReady() {
    if (!socket?.connected) {
      setError("Disconnected from the server.");
      return;
    }

    setLoading(true);
    setError("");

    socket.emit(
      "player:set-ready",
      { ready: !currentPlayer?.ready },
      (response: ServerResponse) => {
        setLoading(false);

        if (!response.success) {
          setError(response.message ?? "Unable to update readiness.");
        }
      },
    );
  }

  return (
    <main>
      <h1>Game lobby</h1>

      <p>You are playing in this game.</p>

      <section>
        <h2>Room code</h2>
        <h1>{room.code}</h1>
      </section>

      <section>
        <h2>Host</h2>
        <p>{room.hostName}</p>
      </section>

      <section>
        <h2>Players ({room.players.length})</h2>

        <ul>
          {room.players.map((player) => (
            <li key={player.id}>
              {player.name}
              {player.id === socket?.id && " (You)"}

              {room.stage === "placement" && (
                <span>{player.ready ? " — Ready" : " — Not ready"}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {error && <p role="alert">{error}</p>}

      {room.stage === "lobby" && (
        <section>
          <p>Waiting for the host to start ship placement.</p>
          {room.locked && <p>The host has locked the lobby.</p>}
        </section>
      )}

      {room.stage === "placement" && (
        <section>
          <h2>Ship placement</h2>

          <p>
            {currentPlayer?.ready ? "You are ready!" : "You are not ready yet."}
          </p>

          <button onClick={toggleReady} disabled={loading || !currentPlayer}>
            {loading
              ? "Updating..."
              : currentPlayer?.ready
                ? "Not ready"
                : "Ready"}
          </button>
        </section>
      )}

      {room.stage === "playing" && (
        <section>
          <h2>Game starting</h2>
          <p>The host has started the game.</p>
        </section>
      )}
    </main>
  );
}

export default PlayerLobby;
