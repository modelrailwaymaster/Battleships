import { useState } from "react";
import { useToast } from "../../components/Toast";
import { getGameSocket } from "../../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../../types/types";

interface JoinGameProps {
  onJoined: (room: PublicRoomState, playerId: string) => void;
  onBack: () => void;
}

function JoinGame({ onJoined, onBack }: JoinGameProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function joinRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const socket = getGameSocket();

    if (!socket?.connected) {
      showToast("Error", "Disconnected from the server.");
      return;
    }

    setLoading(true);

    socket.emit(
      "player:join",
      { roomCode, playerName },
      (response: ServerResponse) => {
        setLoading(false);

        if (!response.success || !response.room || !response.playerId) {
          showToast("Error", "Unable to join room: " + response.message);
          return;
        }

        onJoined(response.room, response.playerId);
      },
    );
  }

  return (
    <div>
      <h1>Join a game</h1>
      <p>Enter the room code provided by the host.</p>

      <form onSubmit={joinRoom}>
        <label htmlFor="player-name">Your name: </label>
        <input
          id="player-name"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          maxLength={20}
          required
          autoComplete="nickname"
        />

        <label htmlFor="room-code">Room code: </label>
        <input
          id="room-code"
          value={roomCode}
          onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
          maxLength={6}
          required
          autoComplete="off"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join game"}
        </button>

        <button type="button" onClick={onBack}>
          Back
        </button>
      </form>
    </div>
  );
}

export default JoinGame;
