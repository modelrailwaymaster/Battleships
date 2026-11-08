interface MainMenuProps {
  onHost: () => void;
  onJoin: () => void;
}

function MainMenu({ onHost, onJoin }: MainMenuProps) {
  return (
    <main className="main-menu">
      <h1>Battleships</h1>
      <p>Multiplayer Battleships</p>

      <div className="menu-buttons">
        <button onClick={onHost}>Host Game</button>
        <button onClick={onJoin}>Join Game</button>
      </div>
    </main>
  );
}

export default MainMenu;
