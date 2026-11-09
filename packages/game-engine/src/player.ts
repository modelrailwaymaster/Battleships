import { Board } from "./board";
import type { PlayerStatus } from "./gameTypes";

export class Player {
  public readonly id: string;
  public readonly name: string;
  public readonly board: Board;

  public status: PlayerStatus = "active";

  constructor(id: string, name: string, boardSize: number = 10) {
    this.id = id;
    this.name = name;
    this.board = new Board(boardSize);
  }

  public eliminate(): void {
    this.status = "eliminated";
  }

  public isActive(): boolean {
    return this.status === "active";
  }
}
