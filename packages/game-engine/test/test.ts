import { Game } from "../src";

const game = new Game({
  boardSize: 10,
});

// Add three players.
const player1 = game.addPlayer("Plater 1");
const player2 = game.addPlayer("Player 2");
const player3 = game.addPlayer("Player 3");

console.log(
  "Players:",
  game.getPlayers().map((p) => p.name),
);

// Give each player a ship.
game.placeShip(
  player1.id,
  "ship-1",
  "Destroyer",
  1,
  { x: 0, y: 0 },
  "horizontal",
);

game.placeShip(
  player2.id,
  "ship-2",
  "Destroyer",
  1,
  { x: 0, y: 0 },
  "horizontal",
);

game.placeShip(
  player3.id,
  "ship-3",
  "Destroyer",
  1,
  { x: 0, y: 0 },
  "horizontal",
);

// Start the game.
game.start();

console.log("\nGame started!");
console.log("Current player:", game.currentPlayer?.name);

// Player 1 attacks Player 2.
const attack1 = game.attack(player2.id, { x: 0, y: 0 });

console.log("\nAttack 1:", attack1.message);
console.log("Player eliminated:", attack1.targetEliminated);
console.log("Next player:", game.currentPlayer?.name);

// Player 3 attacks Player 1.
const attack2 = game.attack(player1.id, { x: 0, y: 0 });

console.log("\nAttack 2:", attack2.message);
console.log("Player eliminated:", attack2.targetEliminated);
console.log("Game over:", attack2.gameOver);

console.log("\nFinal game status:", game.status);
console.log(
  "Remaining players:",
  game
    .getPlayers()
    .filter((p) => p.isActive())
    .map((p) => p.name),
);
