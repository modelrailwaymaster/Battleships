export type GameStatus = "setup" | "placement" | "playing" | "finished";

export type PlayerStatus = "active" | "eliminated";

export type CellState = "empty" | "ship" | "hit" | "miss";

export type Orientation = "horizontal" | "vertical";

export interface Coordinate {
  x: number;
  y: number;
}

export interface ShipDefinition {
  name: string;
  length: number;
}

export interface AttackResult {
  success: boolean;
  hit: boolean;
  sunk: boolean;
  message: string;
}

export interface Cell {
  state: CellState;
  shipId: string | null;
}

export interface GameOptions {
  boardSize?: number;
}
