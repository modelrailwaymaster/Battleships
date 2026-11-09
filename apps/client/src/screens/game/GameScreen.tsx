import { useToast } from "../../components/Toast";
import type { PublicRoomState, RoomRole } from "../../types/types";

import HostPlacement from "./placement/HostPlacement";
import ShipPlacement from "./placement/ShipPlacement";

import Game from "./playing/Game";
import HostGame from "./playing/HostGame";

import HostResults from "./results/HostResults";
import Results from "./results/Results";

interface GameScreenProps {
  room: PublicRoomState;
  role: RoomRole;
}

function GameScreen({ room, role }: GameScreenProps) {
  const { showToast } = useToast();
  if (room.roomStage !== "playing" || room.gameStage === "lobby") {
    showToast("Error", "Room is not currently playing.");
    return null;
  }

  // Host screens
  if (role === "host") {
    switch (room.gameStage) {
      case "placement":
        return <HostPlacement room={room} />;

      case "playing":
        return <HostGame room={room} />;

      case "finished":
        return <HostResults room={room} />;

      default:
        showToast("Error", "Room condition not know.");
        return null;
    }
  }

  // Player screens
  if (role === "player") {
    switch (room.gameStage) {
      case "placement":
        return <ShipPlacement room={room} />;

      case "playing":
        return <Game room={room} />;

      case "finished":
        return <Results room={room} />;

      default:
        showToast("Error", "Room condition not know.");
        return null;
    }
  }

  return null;
}

export default GameScreen;
