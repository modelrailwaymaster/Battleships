interface MainMenuProps {
  onHost: () => void;
  onJoin: () => void;
}

function MainMenu({ onHost, onJoin }: MainMenuProps) {
  return (
    <div className="menu-buttons">
      <button onClick={onHost}>Host Game</button>
      <button onClick={onJoin}>Join Game</button>
    </div>
  );
}

export default MainMenu;
