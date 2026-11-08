export type RoomStage = "lobby" | "placement" | "playing" | "finished";

export interface RoomPlayer {
  id: string;
  name: string;
  ready: boolean;
}

export interface PublicRoomState {
  code: string;
  hostName: string;
  players: RoomPlayer[];
  stage: RoomStage;
  locked: boolean;
}

export interface ServerResponse {
  success: boolean;
  message?: string;
}
