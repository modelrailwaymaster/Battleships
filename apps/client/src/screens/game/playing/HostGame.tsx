import type { PublicRoomState } from "../../../types/types";

interface HostGame {
  room: PublicRoomState;
}

function HostGame({ room }: HostGame) {
  return (
    <div>
      <h1>Host Placement</h1>
      <p>Room code: {room.code}</p>
    </div>
  );
}

export default HostGame;
