import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";

interface PlayerSetupProps {
  onStart: (players: string[]) => void;
  onBack: () => void;
}

export default function PlayerSetup({ onStart, onBack }: PlayerSetupProps) {
  const [players, setPlayers] = useState(["Player 1", "Player 2"]);

  const [error, setError] = useState("");

  function addPlayer() {
    setPlayers((current) => [...current, `Player ${current.length + 1}`]);
  }

  function removePlayer(index: number) {
    setPlayers((current) => current.filter((_, i) => i !== index));
  }

  function updatePlayer(index: number, name: string) {
    setPlayers((current) =>
      current.map((player, i) => (i === index ? name : player)),
    );
  }

  function continueToPlacement() {
    if (players.some((player) => !player.trim())) {
      setError("Every player needs a name.");
      return;
    }

    setError("");
    onStart(players.map((player) => player.trim()));
  }

  return (
    <main className="screen">
      <Header title="Player setup" subtitle="Choose who is taking part" />

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Players</h2>
            <p>{players.length} players added</p>
          </div>

          <Button variant="secondary" onClick={addPlayer}>
            + Add player
          </Button>
        </div>

        <div className="player-list">
          {players.map((player, index) => (
            <div className="player-input" key={index}>
              <span className="player-number">{index + 1}</span>

              <input
                value={player}
                onChange={(event) => updatePlayer(index, event.target.value)}
                placeholder="Player name"
                maxLength={30}
              />

              <button
                className="remove-button"
                onClick={() => removePlayer(index)}
                disabled={players.length <= 2}
                aria-label={`Remove player ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="button-row">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>

          <Button onClick={continueToPlacement}>Continue</Button>
        </div>
      </section>
    </main>
  );
}
