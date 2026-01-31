import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import App from '../../src/App';
import { theme } from '../../src/theme';

const renderApp = (): ReturnType<typeof render> => {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

describe('Basic Game Flow Integration', () => {
  it('should show Start button on initial load', () => {
    renderApp();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('should show game board after clicking Start', async () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    await waitFor(() => {
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
    });

    // Board should have all numbers 0-99
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('should allow selecting numbers in sequence', async () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    // Click on number 0
    fireEvent.click(screen.getByText('0'));

    // Last selected should show 0
    await waitFor(() => {
      const lastValue = screen.getByTestId('last-selected-value');
      expect(lastValue).toHaveTextContent('0');
    });
  });

  it('should show error feedback for wrong number click', async () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    // Click on wrong number (5 instead of 0)
    const wrongCell = screen.getByText('5').closest('div');
    fireEvent.click(screen.getByText('5'));

    // Cell should show error state
    await waitFor(() => {
      expect(wrongCell).toHaveAttribute('data-error', 'true');
    });

    // Error should clear after animation
    await waitFor(
      () => {
        expect(wrongCell).toHaveAttribute('data-error', 'false');
      },
      { timeout: 500 }
    );
  });

  it('should display timer that increments', async () => {
    renderApp();

    // Timer should start at 0
    expect(screen.getByText('0s')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Wait for timer to tick (this uses real timers in integration)
    await waitFor(
      () => {
        expect(screen.queryByText('0s')).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
