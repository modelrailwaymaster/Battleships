import Button from "../components/Button";
import Header from "../components/Header";

interface MainMenuProps {
  onNewGame: () => void;
}

export default function MainMenu({ onNewGame }: MainMenuProps) {
  return (
    <main className="menu-screen">
      <Header
        title="BATTLESHIPS"
        subtitle="A multiplayer naval strategy game"
      />

      <div className="menu-content">
        <div className="menu-icon">⚓</div>

        <h2>Ready for battle?</h2>

        <p>
          Assemble your fleet, challenge your opponents and be the last player
          standing.
        </p>

        <Button onClick={onNewGame}>New game</Button>
      </div>

      <footer> BATTLESHIPS · LOCAL MULTIPLAYER </footer>
    </main>
  );
}
