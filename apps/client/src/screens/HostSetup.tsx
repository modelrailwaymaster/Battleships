import { useState } from "react";
import { getGameSocket } from "../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../types/room";

interface HostSetupProps {
  onCreated: (room: PublicRoomState) => void;
  onBack: () => void;
}

function HostSetup({ onCreated, onBack }: HostSetupProps) {
  const [hostName, setHostName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function createRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const socket = getGameSocket();

    if (!socket?.connected) {
      setError("Not connected to the server. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    socket.emit("host:create", { hostName }, (response: ServerResponse) => {
      setLoading(false);

      if (!response.success || !response.room) {
        setError(response.message ?? "Unable to create room.");
        return;
      }

      onCreated(response.room);
    });
  }

  return (
    <main>
      <h1>Host a game</h1>
      <p>Create a room for other players to join.</p>

      <form onSubmit={createRoom}>
        <label htmlFor="host-name">Your name</label>
        <input
          id="host-name"
          value={hostName}
          onChange={(event) => setHostName(event.target.value)}
          maxLength={20}
          required
          autoComplete="nickname"
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating room..." : "Create room"}
        </button>

        <button type="button" onClick={onBack}>
          Back
        </button>
      </form>
    </main>
  );
}

export default HostSetup;
