import { useState } from "react";
import { useToast } from "../../components/Toast";
import { getGameSocket } from "../../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../../types/types";

interface HostSetupProps {
  onCreated: (room: PublicRoomState) => void;
  onBack: () => void;
}

function HostSetup({ onCreated, onBack }: HostSetupProps) {
  const [hostName, setHostName] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  function createRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const socket = getGameSocket();

    if (!socket?.connected) {
      showToast("Error", "Not connected to the server. Please try again.");
      return;
    }

    setLoading(true);

    socket.emit("host:create", { hostName }, (response: ServerResponse) => {
      setLoading(false);

      if (!response.success || !response.room) {
        showToast("Error", "Unable to create room: " + response.message);
        return;
      }

      onCreated(response.room);
    });
  }

  return (
    <div>
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

        <button type="submit" disabled={loading}>
          {loading ? "Creating room..." : "Create room"}
        </button>

        <button type="button" onClick={onBack}>
          Back
        </button>
      </form>
    </div>
  );
}

export default HostSetup;
