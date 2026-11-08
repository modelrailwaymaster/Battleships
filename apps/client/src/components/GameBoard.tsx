import type { Board, Coordinate } from "@battleships/game-engine";
import type { CSSProperties } from "react";

interface GameBoardProps {
  board: Board;
  onCellClick?: (position: Coordinate) => void;
  showShips?: boolean;
  disabled?: boolean;
}

export default function GameBoard({
  board,
  onCellClick,
  showShips = false,
  disabled = false,
}: GameBoardProps) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${board.size}, minmax(0, 1fr))`,
  };

  return (
    <div className="board" style={gridStyle}>
      {Array.from({ length: board.size * board.size }, (_, index) => {
        const x = index % board.size;
        const y = Math.floor(index / board.size);

        const state = board.getCellState({ x, y });

        const visibleState = state === "ship" && !showShips ? "empty" : state;

        return (
          <button
            key={`${x}-${y}`}
            className={`board-cell cell-${visibleState}`}
            onClick={() => onCellClick?.({ x, y })}
            disabled={
              disabled || !onCellClick || state === "hit" || state === "miss"
            }
            aria-label={`Column ${x + 1}, row ${y + 1}: ${visibleState}`}
          >
            {visibleState === "hit" && "×"}
            {visibleState === "miss" && "•"}
          </button>
        );
      })}
    </div>
  );
}
