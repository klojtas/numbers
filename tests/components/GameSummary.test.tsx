import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/theme';
import { GameSummary } from '../../src/components/GameSummary';
import type { GameResult } from '../../src/types';

/**
 * Test helper to render components with MUI theme
 */
function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('GameSummary', () => {
  const mockTimeLimitResult: GameResult = {
    mode: 'timeLimit',
    numbersFound: 45,
    totalTime: 60,
    isVictory: false,
  };

  const mockCompletionResult: GameResult = {
    mode: 'completion',
    numbersFound: 100,
    totalTime: 125,
    isVictory: true,
  };

  describe('visibility', () => {
    it('should render dialog when open is true', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render dialog when open is false', () => {
      renderWithTheme(
        <GameSummary
          open={false}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Time Limit mode results', () => {
    it('should show "Time\'s Up!" title for time limit mode', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.getByText(/time's up/i)).toBeInTheDocument();
    });

    it('should show numbers found out of total', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      // Check that both numbers are displayed (45 / 100)
      const matches = screen.getAllByText(/45/);
      expect(matches.length).toBeGreaterThan(0);
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('should show time limit reached message', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.getByText(/60.*seconds|time.*60/i)).toBeInTheDocument();
    });
  });

  describe('Completion mode results', () => {
    it('should show "Completed!" title for completion mode', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockCompletionResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    it('should show completion time', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockCompletionResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.getByText(/125.*seconds|time.*125/i)).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should render Play Again button', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
    });

    it('should call onPlayAgain when Play Again button is clicked', () => {
      const onPlayAgain = vi.fn();
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={onPlayAgain}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /play again/i }));
      expect(onPlayAgain).toHaveBeenCalledTimes(1);
    });

    it('should render Close button', () => {
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={vi.fn()}
          onPlayAgain={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should call onClose when Close button is clicked', () => {
      const onClose = vi.fn();
      renderWithTheme(
        <GameSummary
          open={true}
          result={mockTimeLimitResult}
          onClose={onClose}
          onPlayAgain={vi.fn()}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
