import type {
  GameStage as sharedGameStage,
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
export type RoomPlayer = SharedRoomPlayer;
export type GameStage = sharedGameStage;
