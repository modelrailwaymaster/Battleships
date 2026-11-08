import { useState } from "react";
import { getGameSocket } from "../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../types/room";

interface JoinGameProps {
  onJoined: (room: PublicRoomState, playerId: string) => void;
  onBack: () => void;
}

function JoinGame({ onJoined, onBack }: JoinGameProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function joinRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const socket = getGameSocket();

    if (!socket?.connected) {
      setError("Not connected to the server. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    socket.emit(
      "player:join",
      { roomCode, playerName },
      (response: ServerResponse) => {
        setLoading(false);

        if (!response.success || !response.room || !response.playerId) {
          setError(response.message ?? "Unable to join game.");
          return;
        }

        onJoined(response.room, response.playerId);
      },
    );
  }

  return (
    <main>
      <h1>Join a game</h1>
      <p>Enter the room code provided by the host.</p>

      <form onSubmit={joinRoom}>
        <label htmlFor="player-name">Your name</label>
        <input
          id="player-name"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          maxLength={20}
          required
          autoComplete="nickname"
        />

        <label htmlFor="room-code">Room code</label>
        <input
          id="room-code"
          value={roomCode}
          onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
          maxLength={6}
          required
          autoComplete="off"
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join game"}
        </button>

        <button type="button" onClick={onBack}>
          Back
        </button>
      </form>
    </main>
  );
}

export default JoinGame;
