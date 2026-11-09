import type { PublicRoomState } from "../../../types/types";

interface HostPlacementProps {
  room: PublicRoomState;
}

function HostPlacement({ room }: HostPlacementProps) {
  return (
    <div>
      <h1>Host Placement</h1>
      <p>Room code: {room.code}</p>
    </div>
  );
}

export default HostPlacement;
