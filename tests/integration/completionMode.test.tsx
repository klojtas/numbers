import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/theme';
import App from '../../src/App';

/**
 * Test helper to render App with MUI theme
 */
function renderApp(): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

describe('Completion Mode (US3)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should select Completion mode when clicking Completion button', () => {
    renderApp();

    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    expect(completionButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should hide time limit input in Completion mode', () => {
    renderApp();

    // Select Completion mode
    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    // Time limit input should not be visible
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('should allow starting game in Completion mode', () => {
    renderApp();

    // Select Completion mode
    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Game should start - board should be visible
    expect(screen.getByTestId('game-board').children.length).toBe(100);
  });

  it('should continue playing indefinitely in Completion mode (no time limit)', async () => {
    renderApp();

    // Select Completion mode
    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Advance time significantly - game should NOT end
    await act(async () => {
      for (let i = 0; i < 120; i++) {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      }
    });

    // Game should still be playing (no dialog)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    // Start button should be disabled (game still playing)
    expect(screen.getByRole('button', { name: /start/i })).toBeDisabled();
  }, 15000);

  it('should end game and show summary when all 100 numbers are found', async () => {
    renderApp();

    // Select Completion mode
    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Click all numbers 0-99 using aria-label
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        const cell = screen.getByLabelText(`Select number ${i}`);
        fireEvent.click(cell);
      });
    }

    // Game should be completed - dialog should show
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Check for the dialog title "Completed!"
    expect(screen.getByRole('heading', { name: /completed/i })).toBeInTheDocument();
  }, 60000);

  it('should show completion time in summary', async () => {
    renderApp();

    // Select Completion mode
    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Advance time a bit before completing (5 seconds)
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(1000);
      }
    });

    // Click all numbers 0-99 using aria-label
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        const cell = screen.getByLabelText(`Select number ${i}`);
        fireEvent.click(cell);
      });
    }

    // Should show completion time (around 5 seconds)
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/seconds/i)).toBeInTheDocument();
  }, 60000);

  it('should allow playing again after completing', async () => {
    renderApp();

    // Select Completion mode
    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Click all numbers 0-99 using aria-label
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        const cell = screen.getByLabelText(`Select number ${i}`);
        fireEvent.click(cell);
      });
    }

    // Dialog should appear
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click Play Again
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));

    // Dialog should close and Start should be enabled
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).not.toBeDisabled();
  }, 60000);
});
