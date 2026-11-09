import type { PublicRoomState } from "../../../types/types";

interface ShipPlacementProps {
  room: PublicRoomState;
}

function ShipPlacement({ room }: ShipPlacementProps) {
  return (
    <div>
      <h1>Host Placement</h1>
      <p>Room code: {room.code}</p>
    </div>
  );
}

export default ShipPlacement;
