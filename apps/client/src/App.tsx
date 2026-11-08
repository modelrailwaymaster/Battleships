import { Game } from "@battleships/game-engine";
import { useState } from "react";

import type { Screen } from "./types/ui";

import GameScreen from "./screens/GameScreen";
import MainMenu from "./screens/MainMenu";
import PlayerSetup from "./screens/PlayerSetup";
import ShipPlacement from "./screens/ShipPlacement";

import "./App.css";

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [game, setGame] = useState<Game | null>(null);

  function startNewGame() {
    setGame(null);
    setScreen("player-setup");
  }

  function setupPlayers(names: string[]) {
    const newGame = new Game({
      boardSize: 10,
    });

    names.forEach((name) => {
      newGame.addPlayer(name);
    });

    setGame(newGame);
    setScreen("ship-placement");
  }

  function startPlaying() {
    setScreen("game");
  }

  return (
    <div className="app">
      {screen === "menu" && <MainMenu onNewGame={startNewGame} />}

      {screen === "player-setup" && (
        <PlayerSetup onStart={setupPlayers} onBack={() => setScreen("menu")} />
      )}

      {screen === "ship-placement" && game && (
        <ShipPlacement game={game} onComplete={startPlaying} />
      )}

      {screen === "game" && game && <GameScreen game={game} />}
    </div>
  );
}
