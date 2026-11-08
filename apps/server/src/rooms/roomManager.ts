import { randomInt } from "node:crypto";
import { Room } from "./room.js";

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  public createRoom(hostSocketId: string, hostName: string): Room {
    const code = this.generateCode();

    const room = new Room(code, hostSocketId, hostName);

    this.rooms.set(code, room);

    return room;
  }

  public getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  public deleteRoom(code: string): void {
    this.rooms.delete(code);
  }

  public findRoomBySocketId(socketId: string): Room | undefined {
    return [...this.rooms.values()].find(
      (room) => room.hostSocketId === socketId || room.players.has(socketId),
    );
  }

  private generateCode(): string {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code: string;

    do {
      code = Array.from(
        { length: 6 },
        () => characters[randomInt(characters.length)],
      ).join("");
    } while (this.rooms.has(code));

    return code;
  }
}
