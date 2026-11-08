import { useState } from "react";
import { useToast } from "../../components/Toast";
import { getGameSocket } from "../../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../../types/room";

interface PlayerLobbyProps {
  room: PublicRoomState;
}

function PlayerLobby({ room }: PlayerLobbyProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const socket = getGameSocket();

  const currentPlayer = room.players.find((player) => player.id === socket?.id);

  if (!currentPlayer) {
    showToast("Error", "Could not find you on the server.");
    return;
  }

  const everyoneReady =
    room.players.length >= 2 && room.players.every((player) => player.ready);

  function toggleReady() {
    if (!socket?.connected) {
      showToast("Error", "Disconnected from the server.");
      return;
    }

    setLoading(true);

    socket.emit(
      "player:set-ready",
      { ready: !currentPlayer?.ready },
      (response: ServerResponse) => {
        setLoading(false);

        if (!response.success) {
          showToast("Error", "Unable to ready up: " + response.message);
        }
      },
    );
  }

  return (
    <div>
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
        <h2>Status:</h2>
        <p>
          {!currentPlayer.ready
            ? "You need to ready up."
            : everyoneReady
              ? "Waiting for host to start."
              : "Waiting for everyone to ready up."}
        </p>
      </section>

      <section>
        <h2>Players ({room.players.length})</h2>

        <ul>
          {room.players.map((player) => (
            <li key={player.id}>
              {player.name}
              {player.id === socket?.id && " (You)"}
              {player.ready ? " — Ready" : " — Not ready"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        {currentPlayer.ready && (
          <button onClick={toggleReady} disabled={loading || !currentPlayer}>
            {loading
              ? "Updating..."
              : currentPlayer?.ready
                ? "Not ready"
                : "Ready"}
          </button>
        )}
      </section>
    </div>
  );
}

export default PlayerLobby;
