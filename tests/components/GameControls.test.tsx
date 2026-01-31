import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/theme';
import { GameControls } from '../../src/components/GameControls';
import type { GamePhase } from '../../src/types';

/**
 * Test helper to render components with MUI theme
 */
function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('GameControls', () => {
  describe('Start button', () => {
    it('should render Start button', () => {
      renderWithTheme(<GameControls phase="idle" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    });

    it('should enable Start button when idle', () => {
      renderWithTheme(<GameControls phase="idle" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /start/i })).not.toBeDisabled();
    });

    it('should disable Start button when playing', () => {
      renderWithTheme(<GameControls phase="playing" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /start/i })).toBeDisabled();
    });

    it('should disable Start button when ended', () => {
      renderWithTheme(<GameControls phase="ended" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /start/i })).toBeDisabled();
    });

    it('should call onStart when Start button is clicked', () => {
      const onStart = vi.fn();
      renderWithTheme(<GameControls phase="idle" onStart={onStart} onReset={vi.fn()} />);

      fireEvent.click(screen.getByRole('button', { name: /start/i }));
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset button', () => {
    it('should render Reset button', () => {
      renderWithTheme(<GameControls phase="idle" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('should disable Reset button when idle', () => {
      renderWithTheme(<GameControls phase="idle" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled();
    });

    it('should enable Reset button when playing', () => {
      renderWithTheme(<GameControls phase="playing" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /reset/i })).not.toBeDisabled();
    });

    it('should enable Reset button when ended', () => {
      renderWithTheme(<GameControls phase="ended" onStart={vi.fn()} onReset={vi.fn()} />);

      expect(screen.getByRole('button', { name: /reset/i })).not.toBeDisabled();
    });

    it('should call onReset when Reset button is clicked', () => {
      const onReset = vi.fn();
      renderWithTheme(<GameControls phase="playing" onStart={vi.fn()} onReset={onReset} />);

      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('button states by phase', () => {
    const phases: GamePhase[] = ['idle', 'playing', 'ended'];
    const expectedStates: Record<GamePhase, { startDisabled: boolean; resetDisabled: boolean }> = {
      idle: { startDisabled: false, resetDisabled: true },
      playing: { startDisabled: true, resetDisabled: false },
      ended: { startDisabled: true, resetDisabled: false },
    };

    phases.forEach((phase) => {
      it(`should have correct button states for phase "${phase}"`, () => {
        renderWithTheme(<GameControls phase={phase} onStart={vi.fn()} onReset={vi.fn()} />);

        const startButton = screen.getByRole('button', { name: /start/i });
        const resetButton = screen.getByRole('button', { name: /reset/i });

        if (expectedStates[phase].startDisabled) {
          expect(startButton).toBeDisabled();
        } else {
          expect(startButton).not.toBeDisabled();
        }

        if (expectedStates[phase].resetDisabled) {
          expect(resetButton).toBeDisabled();
        } else {
          expect(resetButton).not.toBeDisabled();
        }
      });
    });
  });
});
