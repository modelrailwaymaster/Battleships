import type { Game } from "@battleships/game-engine";
import { useState } from "react";

import GameBoard from "../../../components/GameBoard";
import Header from "../../../components/TopNavBar";

interface GameScreenProps {
  game: Game;
}

export default function GameScreen({ game }: GameScreenProps) {
  const [, setRevision] = useState(0);
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("Choose an opponent to attack.");

  const players = game.getPlayers();
  const currentPlayer = game.currentPlayer;

  const opponents = players.filter(
    (player) => player.isActive() && player.id !== currentPlayer?.id,
  );

  const selectedTarget =
    opponents.find((player) => player.id === targetId) ?? opponents[0];

  const target = selectedTarget;

  function attack(position: { x: number; y: number }) {
    if (!target || !currentPlayer) {
      return;
    }

    const result = game.attack(target.id, position);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    let resultMessage = `${currentPlayer.name}: ${result.message}`;

    if (result.targetEliminated) {
      resultMessage += ` ${target.name} has been eliminated!`;
    }

    if (result.gameOver) {
      const winner = game.getPlayers().find((player) => player.isActive());

      resultMessage = `Game over! ${winner?.name} wins!`;
    }

    setMessage(resultMessage);
    setRevision((value) => value + 1);
  }

  const winner = game.getPlayers().find((player) => player.isActive());

  if (game.status === "finished") {
    return (
      <main className="screen">
        <Header title="Game over" />

        <section className="panel winner-panel">
          <div className="menu-icon">🏆</div>
          <h2>{winner?.name} wins!</h2>
          <p>Congratulations on winning the battle.</p>
        </section>
      </main>
    );
  }

  if (!currentPlayer || !target) {
    return (
      <main className="screen">
        <Header title="Battleships" />
        <section className="panel">
          <p>Waiting for an available opponent.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="screen">
      <Header title="Battleships" subtitle="The battle is underway" />

      <section className="panel">
        <div className="game-heading">
          <div>
            <span className="eyebrow">CURRENT TURN</span>
            <h2>{currentPlayer.name}</h2>
          </div>

          <span className="turn-badge">Your turn</span>
        </div>

        <div className="opponent-selection">
          <label htmlFor="opponent">Attack opponent</label>

          <select
            id="opponent"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
          >
            {opponents.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div className="game-board-container">
          <div>
            <h3>{target.name}'s board</h3>

            <p className="instruction">Select a square to fire.</p>

            <GameBoard board={target.board} onCellClick={attack} />
          </div>
        </div>

        <div className="game-message">{message}</div>
      </section>

      <section className="panel">
        <h3>Players</h3>

        <div className="player-status-list">
          {players.map((player) => (
            <div className="player-status" key={player.id}>
              <span>{player.name}</span>

              <span
                className={
                  player.isActive() ? "status-active" : "status-eliminated"
                }
              >
                {player.isActive() ? "Active" : "Eliminated"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
