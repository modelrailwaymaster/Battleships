import { useState } from "react";
import { useToast } from "../../../components/Toast";
import { getGameSocket } from "../../../hooks/useGameSocket";
import type { PublicRoomState, ServerResponse } from "../../../types/types";

interface HostPlacementProps {
  room: PublicRoomState;
}

function HostPlacement({ room }: HostPlacementProps) {
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

  const everyoneReady =
    room.players.length >= 2 && room.players.every((player) => player.ready);

  function endPlacement() {
    emitHostAction("host:end-placement");
  }

  return (
    <div>
      <h1>Host Placement</h1>
      <p>You are hosting this game.</p>

      <section>
        <h2>Players ({room.players.length})</h2>

        <p>Players placing ships...</p>
        <ul>
          {room.players.map((player) => (
            <li key={player.id}>
              {player.name}
              {player.ready ? " — Ready" : " — Not Ready"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <button onClick={endPlacement} disabled={loading || !everyoneReady}>
          End ship placement
        </button>
      </section>
    </div>
  );
}

export default HostPlacement;
