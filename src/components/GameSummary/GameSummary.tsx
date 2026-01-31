import type { JSX } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import type { GameResult } from '../../types';

/**
 * Props for the GameSummary component
 */
export interface GameSummaryProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Game result to display */
  result: GameResult;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when Play Again is clicked */
  onPlayAgain: () => void;
}

/**
 * GameSummary component shows the game result in a dialog.
 */
export function GameSummary({ open, result, onClose, onPlayAgain }: GameSummaryProps): JSX.Element {
  const isTimeLimit = result.mode === 'timeLimit';
  const title = result.isVictory ? 'Completed!' : "Time's Up!";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          {isTimeLimit ? (
            <>
              <Typography variant="h4" color="primary" gutterBottom>
                {result.numbersFound} / 100
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You found {result.numbersFound} numbers in {result.totalTime} seconds
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h4" color="success.main" gutterBottom>
                {result.totalTime} seconds
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Great job! You found all 100 numbers!
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button variant="contained" color="primary" onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
