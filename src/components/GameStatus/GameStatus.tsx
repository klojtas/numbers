import { memo } from 'react';
import type { JSX } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { formatTime } from '../../hooks/useTimer';

/**
 * Props for the GameStatus component.
 */
export interface GameStatusProps {
  /** Elapsed seconds since game started */
  elapsedSeconds: number;
  /** The last number that was successfully selected (null if none) */
  lastSelectedNumber: number | null;
}

/**
 * Displays the current game status: timer and last selected number.
 */
export const GameStatus = memo(function GameStatus({
  elapsedSeconds,
  lastSelectedNumber,
}: GameStatusProps): JSX.Element {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: 3, sm: 4, md: 6 },
        padding: { xs: 1.5, sm: 2 },
        backgroundColor: 'grey.50',
        borderRadius: 2,
      }}
    >
      {/* Timer */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          Time:
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            minWidth: 60,
          }}
        >
          {formatTime(elapsedSeconds)}
        </Typography>
      </Box>

      {/* Last Selected */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          Last:
        </Typography>
        <Typography
          variant="h5"
          component="div"
          data-testid="last-selected-value"
          sx={{
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
            minWidth: 40,
            color: lastSelectedNumber !== null ? 'success.main' : 'text.disabled',
          }}
        >
          {lastSelectedNumber !== null ? lastSelectedNumber : '-'}
        </Typography>
      </Box>
    </Paper>
  );
});
