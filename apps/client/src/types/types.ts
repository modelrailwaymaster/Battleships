import type {
  PublicRoomState as SharedPublicRoomState,
  RoomPlayer as SharedRoomPlayer,
  RoomRole as SharedRoomRole,
  RoomStage as SharedRoomStage,
  ServerResponse as SharedServerResponse,
} from "@battleships/game-engine/";

export type RoomStage = SharedRoomStage;
export type PublicRoomState = SharedPublicRoomState;
export type ServerResponse = SharedServerResponse;
export type RoomRole = SharedRoomRole;

export interface RoomPlayer extends SharedRoomPlayer {
  shipsPlaced: boolean;
}
