import type { PublicRoomState } from "../../../types/types";

interface Results {
  room: PublicRoomState;
}

function Results({ room }: Results) {
  return (
    <div>
      <h1>Host Placement</h1>
      <p>Room code: {room.code}</p>
    </div>
  );
}

export default Results;
