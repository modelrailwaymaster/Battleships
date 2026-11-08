import type { PublicRoomState, RoomPlayer, RoomStage } from "../types.js";

export class Room {
  public readonly code: string;
  public readonly hostSocketId: string;
  public readonly hostName: string;

  public players: Map<string, RoomPlayer> = new Map();

  public stage: RoomStage = "lobby";
  public locked = false;

  constructor(code: string, hostSocketId: string, hostName: string) {
    this.code = code;
    this.hostSocketId = hostSocketId;
    this.hostName = hostName;
  }

  public addPlayer(id: string, name: string): void {
    this.players.set(id, {
      id,
      name,
      ready: false,
    });
  }

  public removePlayer(id: string): void {
    this.players.delete(id);
  }

  public getPlayer(id: string): RoomPlayer | undefined {
    return this.players.get(id);
  }

  public setPlayerReady(id: string, ready: boolean): boolean {
    const player = this.players.get(id);

    if (!player) return false;

    player.ready = ready;

    return true;
  }

  public allPlayersReady(): boolean {
    return (
      this.players.size >= 2 &&
      [...this.players.values()].every((player) => player.ready)
    );
  }

  public getPublicState(): PublicRoomState {
    return {
      code: this.code,
      hostName: this.hostName,
      players: [...this.players.values()],
      stage: this.stage,
      locked: this.locked,
    };
  }
}
