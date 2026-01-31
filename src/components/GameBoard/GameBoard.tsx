import type { JSX } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { GameCell } from '../GameCell';
import { GAME_CONSTANTS } from '../../types';

/**
 * Props for the GameBoard component.
 */
export interface GameBoardProps {
  /** Array of 100 numbers representing the board layout */
  boardLayout: readonly number[];
  /** Set of numbers that have been selected */
  selectedNumbers: ReadonlySet<number>;
  /** The next expected number in sequence */
  nextExpectedNumber: number;
  /** Whether the game is currently playing */
  isPlaying: boolean;
  /** Callback when a cell is clicked */
  onCellClick: (number: number) => void;
}

/**
 * The 10x10 game board component.
 * Displays all 100 number cells in a grid.
 */
export const GameBoard = memo(function GameBoard({
  boardLayout,
  selectedNumbers,
  nextExpectedNumber,
  isPlaying,
  onCellClick,
}: GameBoardProps): JSX.Element {
  const [errorCell, setErrorCell] = useState<number | null>(null);

  // Clear error state after animation
  useEffect(() => {
    if (errorCell !== null) {
      const timer = setTimeout(() => {
        setErrorCell(null);
      }, 200);
      return (): void => clearTimeout(timer);
    }
  }, [errorCell]);

  const handleCellClick = useCallback(
    (number: number): void => {
      if (!isPlaying) return;

      if (number === nextExpectedNumber) {
        onCellClick(number);
      } else {
        // Show error feedback for wrong click
        setErrorCell(number);
      }
    },
    [isPlaying, nextExpectedNumber, onCellClick]
  );

  if (boardLayout.length === 0) {
    return (
      <Box
        data-testid="game-board"
        sx={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'divider',
        }}
      />
    );
  }

  return (
    <Box
      data-testid="game-board"
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GAME_CONSTANTS.GRID_DIMENSION}, 1fr)`,
        gap: { xs: 0.5, sm: 0.75, md: 1 },
        padding: { xs: 1, sm: 1.5, md: 2 },
        backgroundColor: 'grey.100',
        borderRadius: 2,
        maxWidth: { xs: '100%', sm: 500, md: 600 },
        margin: '0 auto',
      }}
    >
      {boardLayout.map((number, position) => (
        <GameCell
          key={position}
          number={number}
          isSelected={selectedNumbers.has(number)}
          isClickable={isPlaying && !selectedNumbers.has(number)}
          onSelect={handleCellClick}
          showError={errorCell === number}
        />
      ))}
    </Box>
  );
});
