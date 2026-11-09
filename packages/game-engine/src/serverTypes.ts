export type RoomStage = "lobby" | "setup" | "playing";
export type GameStage = "lobby" | "placement" | "playing" | "finished";
export type RoomRole = "host" | "player" | "unknown";

export interface RoomPlayer {
  id: string;
  name: string;
  ready: boolean;
}

export interface PublicRoomState {
  code: string;
  hostName: string;
  players: RoomPlayer[];
  gameStage: GameStage;
  roomStage: RoomStage;
  locked: boolean;
}

export interface ServerResponse {
  success: boolean;
  message?: string;
  room?: PublicRoomState;
  playerId?: string;
}
