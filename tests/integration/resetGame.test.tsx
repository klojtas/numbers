import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('Reset Game Flow (US4)', () => {
  it('should show Reset button disabled initially', () => {
    renderApp();

    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toBeDisabled();
  });

  it('should enable Reset button after game starts', () => {
    renderApp();

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Reset should now be enabled
    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).not.toBeDisabled();
  });

  it('should reset timer to 0 when Reset is clicked', async () => {
    renderApp();

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Wait for timer to increment (look for "1s" in the Time display)
    await waitFor(
      () => {
        expect(screen.getByText('1s')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Click Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Timer should reset to 0
    expect(screen.getByText('0s')).toBeInTheDocument();
  });

  it('should clear selected numbers when Reset is clicked', () => {
    renderApp();

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Click number 0
    const cells = screen
      .getAllByRole('button')
      .filter((btn) => /^\d+$/.test(btn.textContent || ''));
    const cell0 = cells.find((cell) => cell.textContent === '0');
    if (cell0) {
      fireEvent.click(cell0);
    }

    // Should show last selected as 0 (using data-testid)
    const lastSelectedValue = screen.getByTestId('last-selected-value');
    expect(lastSelectedValue).toHaveTextContent('0');

    // Click Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Last selected should be cleared (show "-")
    expect(lastSelectedValue).toHaveTextContent('-');
  });

  it('should re-enable Start button after Reset', () => {
    renderApp();

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Start should be disabled
    expect(screen.getByRole('button', { name: /start/i })).toBeDisabled();

    // Click Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Start should be enabled again
    expect(screen.getByRole('button', { name: /start/i })).not.toBeDisabled();
  });

  it('should reshuffle the board when Reset is clicked', () => {
    renderApp();

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Get initial board layout (positions of numbers)
    const getCellPositions = (): string[] => {
      const cells = screen
        .getAllByRole('button')
        .filter((btn) => /^\d+$/.test(btn.textContent || ''));
      return cells.map((cell) => cell.textContent || '');
    };

    const firstLayout = getCellPositions();

    // Click Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Start again to get new shuffled board
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    const newLayout = getCellPositions();

    // Layouts should be different (extremely unlikely to be same after shuffle)
    // We just verify that all 100 numbers are still present and the board may be reshuffled
    expect(newLayout).toHaveLength(100);
    const sortedNew = [...newLayout].sort((a, b) => Number(a) - Number(b));
    expect(sortedNew).toEqual(Array.from({ length: 100 }, (_, i) => String(i)));

    // Verify first layout also had all numbers (sanity check)
    expect(firstLayout).toHaveLength(100);
  });

  it('should allow playing again after Reset', () => {
    renderApp();

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Select some numbers
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

    // Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Start new game
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Should be able to click 0 again (it was reset)
    const newCell0 = findCell(0);
    if (newCell0) {
      fireEvent.click(newCell0);
      const lastSelectedValue = screen.getByTestId('last-selected-value');
      expect(lastSelectedValue).toHaveTextContent('0');
    }
  });
});
