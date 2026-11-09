import type { Coordinate } from "./gameTypes";

export class Ship {
  public readonly id: string;
  public readonly name: string;
  public readonly length: number;
  public readonly positions: Coordinate[];

  private hits: Set<string> = new Set();

  constructor(id: string, name: string, positions: Coordinate[]) {
    this.id = id;
    this.name = name;
    this.positions = positions;
    this.length = positions.length;
  }

  public receiveAttack(position: Coordinate): boolean {
    const key = this.getPositionKey(position);

    const occupiesPosition = this.positions.some(
      (p) => this.getPositionKey(p) === key,
    );

    if (!occupiesPosition || this.hits.has(key)) {
      return false;
    }

    this.hits.add(key);
    return true;
  }

  public isSunk(): boolean {
    return this.hits.size === this.length;
  }

  public getHits(): number {
    return this.hits.size;
  }

  private getPositionKey(position: Coordinate): string {
    return `${position.x},${position.y}`;
  }
}
