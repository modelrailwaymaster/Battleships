import type { Coordinate, Game, Orientation } from "@battleships/game-engine";
import { useState } from "react";

import Button from "../components/Button";
import GameBoard from "../components/GameBoard";
import Header from "../components/Header";

interface ShipPlacementProps {
  game: Game;
  onComplete: () => void;
}

const fleet = [
  { name: "Carrier", length: 5 },
  { name: "Battleship", length: 4 },
  { name: "Cruiser", length: 3 },
  { name: "Submarine", length: 3 },
  { name: "Destroyer", length: 2 },
];

export default function ShipPlacement({
  game,
  onComplete,
}: ShipPlacementProps) {
  const players = game.getPlayers();

  const [playerIndex, setPlayerIndex] = useState(0);
  const [shipIndex, setShipIndex] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");

  const [error, setError] = useState("");

  const player = players[playerIndex];
  const ship = fleet[shipIndex];

  function placeShip(position: Coordinate) {
    const success = game.placeShip(
      player.id,
      `${player.id}-${ship.name}`,
      ship.name,
      ship.length,
      position,
      orientation,
    );

    if (!success) {
      setError("That ship cannot be placed there. Try another position.");
      return;
    }

    setError("");

    // Move to the next ship.
    if (shipIndex < fleet.length - 1) {
      setShipIndex((current) => current + 1);
      return;
    }

    // Move to the next player.
    if (playerIndex < players.length - 1) {
      setPlayerIndex((current) => current + 1);
      setShipIndex(0);
      return;
    }

    // Everyone has finished placing their ships.
    game.start();
    onComplete();
  }

  return (
    <main className="screen">
      <Header
        title="Ship placement"
        subtitle="Position your fleet before battle"
      />

      <section className="panel">
        <div className="placement-heading">
          <div>
            <span className="eyebrow">
              PLAYER {playerIndex + 1} OF {players.length}
            </span>

            <h2>{player.name}</h2>
          </div>

          <span className="step-indicator">
            Ship {shipIndex + 1} of {fleet.length}
          </span>
        </div>

        <div className="placement-layout">
          <div>
            <p className="instruction">
              Select a starting square for your {ship.name}.
            </p>

            <GameBoard board={player.board} showShips onCellClick={placeShip} />
          </div>

          <aside className="placement-options">
            <h3>Current ship</h3>

            <div className="ship-card">
              <strong>{ship.name}</strong>
              <span>{ship.length} squares</span>
            </div>

            <h3>Orientation</h3>

            <div className="orientation-options">
              <Button
                variant={orientation === "horizontal" ? "primary" : "secondary"}
                onClick={() => setOrientation("horizontal")}
              >
                Horizontal
              </Button>

              <Button
                variant={orientation === "vertical" ? "primary" : "secondary"}
                onClick={() => setOrientation("vertical")}
              >
                Vertical
              </Button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <p className="help-text">
              Ships cannot overlap or extend beyond the board.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
