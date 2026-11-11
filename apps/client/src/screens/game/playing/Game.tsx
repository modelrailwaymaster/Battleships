import type { PublicRoomState } from "../../../types/types";

interface Game {
  room: PublicRoomState;
}

function Game({ room }: Game) {
  return (
    <div>
      <h1>Game</h1>
      <p>Room code: {room.code}</p>
    </div>
  );
}

export default Game;
