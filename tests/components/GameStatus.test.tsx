import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { GameStatus } from '../../src/components/GameStatus/GameStatus';
import { theme } from '../../src/theme';

const renderWithTheme = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('GameStatus', () => {
  it('should display elapsed time', () => {
    renderWithTheme(<GameStatus elapsedSeconds={45} lastSelectedNumber={null} />);

    expect(screen.getByText('45s')).toBeInTheDocument();
  });

  it('should format time with minutes when over 60 seconds', () => {
    renderWithTheme(<GameStatus elapsedSeconds={90} lastSelectedNumber={null} />);

    expect(screen.getByText('1:30')).toBeInTheDocument();
  });

  it('should display last selected number', () => {
    renderWithTheme(<GameStatus elapsedSeconds={0} lastSelectedNumber={42} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should show dash when no number selected yet', () => {
    renderWithTheme(<GameStatus elapsedSeconds={0} lastSelectedNumber={null} />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should have accessible labels', () => {
    renderWithTheme(<GameStatus elapsedSeconds={30} lastSelectedNumber={5} />);

    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('Last:')).toBeInTheDocument();
  });

  it('should display 0 as last selected when 0 is selected', () => {
    renderWithTheme(<GameStatus elapsedSeconds={0} lastSelectedNumber={0} />);

    // Should show "0" not "-"
    const lastValue = screen.getByTestId('last-selected-value');
    expect(lastValue).toHaveTextContent('0');
  });
});
