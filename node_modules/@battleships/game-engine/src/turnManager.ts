import type { Player } from "./player";
import { PlayerManager } from "./playerManager";

export class TurnManager {
  private playerManager: PlayerManager;
  private currentPlayerId: string | null = null;

  constructor(playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public start(): void {
    const activePlayers = this.playerManager.getActivePlayers();

    if (activePlayers.length === 0) {
      throw new Error("There are no active players.");
    }

    this.currentPlayerId = activePlayers[0].id;
  }

  public getCurrentPlayer(): Player | null {
    if (this.currentPlayerId === null) {
      return null;
    }

    return this.playerManager.getPlayer(this.currentPlayerId) ?? null;
  }

  public advanceTurn(): void {
    const players = this.playerManager.getPlayers();

    if (players.length === 0) {
      this.currentPlayerId = null;
      return;
    }

    const currentIndex = players.findIndex(
      (player) => player.id === this.currentPlayerId,
    );

    for (let i = 1; i <= players.length; i++) {
      const nextIndex = (currentIndex + i) % players.length;
      const nextPlayer = players[nextIndex];

      if (nextPlayer.isActive()) {
        this.currentPlayerId = nextPlayer.id;
        return;
      }
    }

    this.currentPlayerId = null;
  }
}
