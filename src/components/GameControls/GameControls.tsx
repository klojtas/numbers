import type { JSX } from 'react';
import { Box, Button } from '@mui/material';
import type { GamePhase } from '../../types';

/**
 * Props for the GameControls component
 */
export interface GameControlsProps {
  /** Current game phase */
  phase: GamePhase;
  /** Callback when Start button is clicked */
  onStart: () => void;
  /** Callback when Reset button is clicked */
  onReset: () => void;
}

/**
 * GameControls component provides Start and Reset buttons for the game.
 *
 * Button states by phase:
 * - idle: Start enabled, Reset disabled
 * - playing: Start disabled, Reset enabled
 * - ended: Start disabled, Reset enabled
 */
export function GameControls({ phase, onStart, onReset }: GameControlsProps): JSX.Element {
  const canStart = phase === 'idle';
  const canReset = phase === 'playing' || phase === 'ended';

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onStart}
        disabled={!canStart}
      >
        Start
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        onClick={onReset}
        disabled={!canReset}
      >
        Reset
      </Button>
    </Box>
  );
}
