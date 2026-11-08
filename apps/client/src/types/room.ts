export type GameStage = "lobby" | "placement" | "playing" | "finished";
export type RoomStage = "setup" | "lobby" | "playing";
export type RoomRole = "host" | "player" | "unknown";

export interface RoomPlayer {
  id: string;
  name: string;
  ready: boolean;
  shipsPlaced: boolean;
}

export interface PublicRoomState {
  code: string;
  hostName: string;
  players: RoomPlayer[];
  roomStage: RoomStage;
  gameStage: GameStage;
  locked: boolean;
}

export interface ServerResponse {
  success: boolean;
  message?: string;
  room?: PublicRoomState;
  playerId?: string;
}
