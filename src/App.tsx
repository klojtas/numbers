import type { JSX } from 'react';
import { useMemo, useCallback, useState } from 'react';
import { Container, Typography, Stack, Box } from '@mui/material';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { GameControls } from './components/GameControls';
import { ModeSelector } from './components/ModeSelector';
import { TimeLimitInput } from './components/TimeLimitInput';
import { GameSummary } from './components/GameSummary';
import { useGame } from './hooks/useGame';
import { useTimer } from './hooks/useTimer';
import type { GameMode } from './types';

/**
 * Main application component for the Number Sequence Game.
 */
function App(): JSX.Element {
  const {
    state,
    startGame: originalStartGame,
    resetGame: originalResetGame,
    selectNumber,
    tick,
    timeUp,
    setMode,
    setTimeLimit,
    getResult,
  } = useGame();
  const [summaryDismissed, setSummaryDismissed] = useState(false);

  // Determine if summary should be shown based on game phase and dismissal state
  const shouldShowSummary = state.phase === 'ended' && !summaryDismissed;

  // Wrap startGame to reset dismissal flag
  const startGame = useCallback((): void => {
    setSummaryDismissed(false);
    originalStartGame();
  }, [originalStartGame]);

  // Wrap resetGame to reset dismissal flag
  const resetGame = useCallback((): void => {
    setSummaryDismissed(false);
    originalResetGame();
  }, [originalResetGame]);

  // Calculate last selected number (nextExpectedNumber - 1, or null if none selected)
  const lastSelectedNumber = useMemo((): number | null => {
    if (state.nextExpectedNumber === 0) {
      return null;
    }
    return state.nextExpectedNumber - 1;
  }, [state.nextExpectedNumber]);

  // Handle cell click - validates and selects number
  const handleCellClick = useCallback(
    (number: number): void => {
      selectNumber(number);
    },
    [selectNumber]
  );

  // Handle mode change
  const handleModeChange = useCallback(
    (mode: GameMode): void => {
      setMode(mode);
    },
    [setMode]
  );

  // Handle time limit change
  const handleTimeLimitChange = useCallback(
    (value: number): void => {
      setTimeLimit(value);
    },
    [setTimeLimit]
  );

  // Handle time up - show summary
  const handleTimeUp = useCallback((): void => {
    timeUp();
  }, [timeUp]);

  // Handle tick - just update elapsed time
  const handleTick = useCallback((): void => {
    tick();
  }, [tick]);

  // Handle closing summary - mark as dismissed
  const handleCloseSummary = useCallback((): void => {
    setSummaryDismissed(true);
  }, []);

  // Handle play again from summary - resetGame already resets dismissal flag
  const handlePlayAgain = useCallback((): void => {
    resetGame();
  }, [resetGame]);

  // Setup timer
  useTimer({
    isRunning: state.phase === 'playing',
    elapsedSeconds: state.elapsedSeconds,
    timeLimit: state.mode === 'timeLimit' ? state.timeLimitSeconds : undefined,
    onTick: handleTick,
    onTimeUp: handleTimeUp,
  });

  // Get result for summary
  const result = getResult();

  // Final check if summary can be shown (needs result to be available)
  const canShowSummary = shouldShowSummary && result !== null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3} alignItems="center">
        {/* Title */}
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          fontWeight={600}
          color="primary.main"
        >
          Number Sequence Game
        </Typography>

        {/* Mode Selection */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <ModeSelector
            selectedMode={state.mode}
            onModeChange={handleModeChange}
            disabled={state.phase !== 'idle'}
          />
          {state.mode === 'timeLimit' && (
            <TimeLimitInput
              value={state.timeLimitSeconds}
              onChange={handleTimeLimitChange}
              disabled={state.phase !== 'idle'}
            />
          )}
        </Box>

        {/* Game Status */}
        <GameStatus elapsedSeconds={state.elapsedSeconds} lastSelectedNumber={lastSelectedNumber} />

        {/* Game Board */}
        <GameBoard
          boardLayout={state.boardLayout}
          selectedNumbers={state.selectedNumbers}
          nextExpectedNumber={state.nextExpectedNumber}
          isPlaying={state.phase === 'playing'}
          onCellClick={handleCellClick}
        />

        {/* Controls */}
        <GameControls phase={state.phase} onStart={startGame} onReset={resetGame} />

        {/* Instructions */}
        {state.phase === 'idle' && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Click Start and then select numbers 0-99 in ascending order as fast as you can!
          </Typography>
        )}
      </Stack>

      {/* Game Summary Dialog */}
      {result && (
        <GameSummary
          open={canShowSummary}
          result={result}
          onClose={handleCloseSummary}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </Container>
  );
}

export default App;
