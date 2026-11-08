import { Player } from "./player";

export class PlayerManager {
  private players: Map<string, Player> = new Map();

  public addPlayer(player: Player): void {
    if (this.players.has(player.id)) {
      throw new Error(`Player ID "${player.id}" already exists.`);
    }

    this.players.set(player.id, player);
  }

  public getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  public getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  public getActivePlayers(): Player[] {
    return this.getPlayers().filter((player) => player.isActive());
  }

  public getPlayerCount(): number {
    return this.players.size;
  }

  public getActivePlayerCount(): number {
    return this.getActivePlayers().length;
  }

  public eliminatePlayer(id: string): boolean {
    const player = this.getPlayer(id);

    if (!player || !player.isActive()) {
      return false;
    }

    player.eliminate();

    return true;
  }
}
