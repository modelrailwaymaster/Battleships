import type { PublicRoomState } from "../../../types/types";

interface HostResults {
  room: PublicRoomState;
}

function HostResults({ room }: HostResults) {
  return (
    <div>
      <h1>Host Placement</h1>
      <p>Room code: {room.code}</p>
    </div>
  );
}

export default HostResults;
