import { Player } from "./player";
import { PlayerManager } from "./playerManager";
import { TurnManager } from "./turnManager";

import type {
    AttackResult,
    Coordinate,
    GameOptions,
    GameStatus,
    Orientation,
} from "./gameTypes";

export interface GameAttackResult extends AttackResult {
  attackerId: string;
  targetId: string;
  targetEliminated: boolean;
  gameOver: boolean;
}

export class Game {
  private playerManager: PlayerManager;
  private turnManager: TurnManager;

  private boardSize: number;
  private nextPlayerNumber = 1;

  private _status: GameStatus = "setup";

  constructor(options: GameOptions = {}) {
    this.boardSize = options.boardSize ?? 10;

    this.playerManager = new PlayerManager();
    this.turnManager = new TurnManager(this.playerManager);
  }

  public get status(): GameStatus {
    return this._status;
  }

  public get currentPlayer(): Player | null {
    if (this._status !== "playing") {
      return null;
    }

    return this.turnManager.getCurrentPlayer();
  }

  public getPlayers(): Player[] {
    return this.playerManager.getPlayers();
  }

  public getPlayer(id: string): Player | undefined {
    return this.playerManager.getPlayer(id);
  }

  public addPlayer(name: string): Player {
    if (this._status !== "setup") {
      throw new Error("Players can only join during setup.");
    }

    if (!name.trim()) {
      throw new Error("Player name cannot be empty.");
    }

    const id = `player-${this.nextPlayerNumber++}`;

    const player = new Player(id, name.trim(), this.boardSize);

    this.playerManager.addPlayer(player);

    return player;
  }

  public placeShip(
    playerId: string,
    shipId: string,
    name: string,
    length: number,
    start: Coordinate,
    orientation: Orientation,
  ): boolean {
    if (!(this._status === "placement" || this._status === "setup")) {
      return false;
    }

    const player = this.playerManager.getPlayer(playerId);

    if (!player) {
      return false;
    }

    const placed = player.board.placeShip(
      shipId,
      name,
      length,
      start,
      orientation,
    );

    return placed;
  }

  public start(): void {
    if (this._status !== "setup" && this._status !== "placement") {
      throw new Error("Game has already started.");
    }

    if (this.playerManager.getPlayerCount() < 2) {
      throw new Error("At least two players are required.");
    }

    const players = this.playerManager.getPlayers();

    for (const player of players) {
      if (player.board.getShips().length === 0) {
        throw new Error(`${player.name} has not placed any ships.`);
      }
    }

    this.turnManager.start();
    this._status = "playing";
  }

  public attack(targetId: string, position: Coordinate): GameAttackResult {
    const attacker = this.currentPlayer;

    if (!attacker) {
      throw new Error("The game is not currently being played.");
    }

    const target = this.playerManager.getPlayer(targetId);

    if (!target) {
      return this.failedAttack(
        attacker.id,
        targetId,
        "Target player does not exist.",
      );
    }

    if (target.id === attacker.id) {
      return this.failedAttack(
        attacker.id,
        targetId,
        "You cannot attack yourself.",
      );
    }

    if (!target.isActive()) {
      return this.failedAttack(
        attacker.id,
        targetId,
        "This player has already been eliminated.",
      );
    }

    const result = target.board.attack(position);

    if (!result.success) {
      return {
        ...result,
        attackerId: attacker.id,
        targetId: target.id,
        targetEliminated: false,
        gameOver: false,
      };
    }

    let targetEliminated = false;

    if (target.board.allShipsSunk()) {
      this.playerManager.eliminatePlayer(target.id);
      targetEliminated = true;
    }

    const gameOver = this.playerManager.getActivePlayerCount() <= 1;

    if (gameOver) {
      this._status = "finished";
    } else {
      this.turnManager.advanceTurn();
    }

    return {
      ...result,
      attackerId: attacker.id,
      targetId: target.id,
      targetEliminated,
      gameOver,
    };
  }

  private failedAttack(
    attackerId: string,
    targetId: string,
    message: string,
  ): GameAttackResult {
    return {
      success: false,
      hit: false,
      sunk: false,
      message,
      attackerId,
      targetId,
      targetEliminated: false,
      gameOver: false,
    };
  }
}
