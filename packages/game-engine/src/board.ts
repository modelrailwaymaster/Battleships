import type {
    AttackResult,
    Cell,
    CellState,
    Coordinate,
    Orientation,
} from "./gameTypes";
import { Ship } from "./ship";

export class Board {
  public readonly size: number;
  private readonly minGridSize: number = 10;

  private grid: Cell[][];
  private ships: Map<string, Ship> = new Map();

  constructor(size: number = this.minGridSize) {
    if (!Number.isInteger(size) || size < this.minGridSize) {
      throw new Error("Board size must be a positive integer.");
    }

    this.size = size;

    this.grid = Array.from({ length: size }, () =>
      Array.from(
        { length: size },
        (): Cell => ({
          state: "empty",
          shipId: null,
        }),
      ),
    );
  }

  public placeShip(
    id: string,
    name: string,
    length: number,
    start: Coordinate,
    orientation: Orientation,
  ): boolean {
    if (!Number.isInteger(length) || length < 1 || this.ships.has(id)) {
      return false;
    }

    const positions: Coordinate[] = [];

    for (let i = 0; i < length; i++) {
      const position: Coordinate = {
        x: start.x + (orientation === "horizontal" ? i : 0),
        y: start.y + (orientation === "vertical" ? i : 0),
      };

      if (!this.isInsideBoard(position)) {
        return false;
      }

      if (this.getCell(position).shipId !== null) {
        return false;
      }

      positions.push(position);
    }

    const ship = new Ship(id, name, positions);

    for (const position of positions) {
      const cell = this.getCell(position);
      cell.state = "ship";
      cell.shipId = id;
    }

    this.ships.set(id, ship);

    return true;
  }

  public attack(position: Coordinate): AttackResult {
    if (!this.isInsideBoard(position)) {
      return {
        success: false,
        hit: false,
        sunk: false,
        message: "Position is outside the board.",
      };
    }

    const cell = this.getCell(position);

    if (cell.state === "hit" || cell.state === "miss") {
      return {
        success: false,
        hit: false,
        sunk: false,
        message: "This position has already been attacked.",
      };
    }

    if (cell.shipId === null) {
      cell.state = "miss";

      return {
        success: true,
        hit: false,
        sunk: false,
        message: "Miss!",
      };
    }

    cell.state = "hit";

    const ship = this.ships.get(cell.shipId)!;
    ship.receiveAttack(position);

    const sunk = ship.isSunk();

    return {
      success: true,
      hit: true,
      sunk,
      message: sunk ? `${ship.name} sunk!` : "Hit!",
    };
  }

  public allShipsSunk(): boolean {
    return (
      this.ships.size > 0 &&
      [...this.ships.values()].every((ship) => ship.isSunk())
    );
  }

  public getCellState(position: Coordinate): CellState {
    if (!this.isInsideBoard(position)) {
      throw new Error("Position is outside the board.");
    }

    return this.getCell(position).state;
  }

  public getShips(): Ship[] {
    return [...this.ships.values()];
  }

  private isInsideBoard(position: Coordinate): boolean {
    return (
      Number.isInteger(position.x) &&
      Number.isInteger(position.y) &&
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < this.size &&
      position.y < this.size
    );
  }

  private getCell(position: Coordinate): Cell {
    return this.grid[position.y][position.x];
  }
}
