import type { PublicRoomState } from "../../../types/types";

interface Game {
  room: PublicRoomState;
}

function Game({ room }: Game) {
  return (
    <div>
      <h1>Host Placement</h1>
      <p>Room code: {room.code}</p>
    </div>
  );
}

export default Game;
