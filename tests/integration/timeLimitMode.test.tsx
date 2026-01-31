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

describe('Time Limit Mode (US2)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show mode selector on initial load', () => {
    renderApp();

    expect(screen.getByRole('group')).toBeInTheDocument();
    // Use specific role queries to avoid multiple matches
    expect(screen.getByRole('button', { name: /time limit mode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completion mode/i })).toBeInTheDocument();
  });

  it('should show time limit input when Time Limit mode is selected', () => {
    renderApp();

    // Time Limit mode is default, so input should already be visible
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should hide time limit input when Completion mode is selected', () => {
    renderApp();

    // Select Completion mode
    const completionButton = screen.getByRole('button', { name: /completion mode/i });
    fireEvent.click(completionButton);

    // Time limit input should not be visible
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('should allow setting custom time limit', () => {
    renderApp();

    // Change time limit
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '30' } });

    expect(input).toHaveValue(30);
  });

  it('should disable mode selector during game', () => {
    renderApp();

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Mode selector buttons should be disabled
    expect(screen.getByRole('button', { name: /time limit mode/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /completion mode/i })).toBeDisabled();
  });

  it('should end game when time limit is reached', async () => {
    renderApp();

    // Set a short time limit
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10' } });

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Advance timers to trigger time up
    await act(async () => {
      // Advance by 11 seconds (10 second limit + 1 extra)
      for (let i = 0; i < 11; i++) {
        vi.advanceTimersByTime(1000);
        await Promise.resolve(); // Allow state updates
      }
    });

    // Game should have ended - check for dialog
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  }, 10000);

  it('should show summary dialog when time runs out', async () => {
    renderApp();

    // Set short time limit
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10' } });

    // Start game and select a few numbers
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Click a couple numbers
    const findCell = (num: number): HTMLElement | undefined => {
      const cells = screen
        .getAllByRole('button')
        .filter((btn) => /^\d+$/.test(btn.textContent || ''));
      return cells.find((cell) => cell.textContent === String(num));
    };

    const cell0 = findCell(0);
    if (cell0) fireEvent.click(cell0);
    const cell1 = findCell(1);
    if (cell1) fireEvent.click(cell1);

    // Advance time
    await act(async () => {
      for (let i = 0; i < 11; i++) {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      }
    });

    // Should show game summary
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/time's up/i)).toBeInTheDocument();
  }, 10000);

  it('should show numbers found in summary', async () => {
    renderApp();

    // Set short time limit
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10' } });

    // Start game and select numbers
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    const findCell = (num: number): HTMLElement | undefined => {
      const cells = screen
        .getAllByRole('button')
        .filter((btn) => /^\d+$/.test(btn.textContent || ''));
      return cells.find((cell) => cell.textContent === String(num));
    };

    // Select 0, 1, 2
    for (let i = 0; i < 3; i++) {
      const cell = findCell(i);
      if (cell) fireEvent.click(cell);
    }

    // Time's up
    await act(async () => {
      for (let i = 0; i < 11; i++) {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      }
    });

    // Should show dialog with numbers found
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Check that the dialog contains text about 3 numbers found
    expect(screen.getByText(/You found 3 numbers/i)).toBeInTheDocument();
  }, 10000);

  it('should allow playing again from summary', async () => {
    renderApp();

    // Set short time limit
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10' } });

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Time's up
    await act(async () => {
      for (let i = 0; i < 11; i++) {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      }
    });

    // Click Play Again
    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    fireEvent.click(playAgainButton);

    // Dialog should close and Start button should be enabled
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).not.toBeDisabled();
  }, 10000);
});
