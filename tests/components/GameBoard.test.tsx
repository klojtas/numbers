import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { GameBoard } from '../../src/components/GameBoard/GameBoard';
import { theme } from '../../src/theme';

const renderWithTheme = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('GameBoard', () => {
  const mockBoardLayout = Array.from({ length: 100 }, (_, i) => i);
  const emptySelectedNumbers = new Set<number>();

  it('should render 100 cells', () => {
    renderWithTheme(
      <GameBoard
        boardLayout={mockBoardLayout}
        selectedNumbers={emptySelectedNumbers}
        nextExpectedNumber={0}
        isPlaying={true}
        onCellClick={vi.fn()}
      />
    );

    // Check for a few numbers to confirm cells are rendered
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('should arrange cells in 10x10 grid', () => {
    const { container } = renderWithTheme(
      <GameBoard
        boardLayout={mockBoardLayout}
        selectedNumbers={emptySelectedNumbers}
        nextExpectedNumber={0}
        isPlaying={true}
        onCellClick={vi.fn()}
      />
    );

    const grid = container.querySelector('[data-testid="game-board"]');
    expect(grid).toBeInTheDocument();
  });

  it('should pass correct props to cells based on game state', () => {
    const selectedNumbers = new Set([0, 1, 2]);

    renderWithTheme(
      <GameBoard
        boardLayout={mockBoardLayout}
        selectedNumbers={selectedNumbers}
        nextExpectedNumber={3}
        isPlaying={true}
        onCellClick={vi.fn()}
      />
    );

    // Cell 0 should be selected
    const cell0 = screen.getByText('0').closest('div');
    expect(cell0).toHaveAttribute('data-selected', 'true');

    // Cell 3 should not be selected (it's next)
    const cell3 = screen.getByText('3').closest('div');
    expect(cell3).toHaveAttribute('data-selected', 'false');
  });

  it('should call onCellClick when correct number is clicked', () => {
    const onCellClick = vi.fn();

    renderWithTheme(
      <GameBoard
        boardLayout={mockBoardLayout}
        selectedNumbers={emptySelectedNumbers}
        nextExpectedNumber={0}
        isPlaying={true}
        onCellClick={onCellClick}
      />
    );

    // Click on the correct next number (0)
    fireEvent.click(screen.getByText('0'));
    expect(onCellClick).toHaveBeenCalledWith(0);
  });

  it('should not call onCellClick when wrong number is clicked', () => {
    const onCellClick = vi.fn();

    renderWithTheme(
      <GameBoard
        boardLayout={mockBoardLayout}
        selectedNumbers={emptySelectedNumbers}
        nextExpectedNumber={0}
        isPlaying={true}
        onCellClick={onCellClick}
      />
    );

    // Click on wrong number (42 instead of 0)
    fireEvent.click(screen.getByText('42'));
    expect(onCellClick).not.toHaveBeenCalled();
  });

  it('should not render cells when board is empty', () => {
    renderWithTheme(
      <GameBoard
        boardLayout={[]}
        selectedNumbers={emptySelectedNumbers}
        nextExpectedNumber={0}
        isPlaying={false}
        onCellClick={vi.fn()}
      />
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should disable cell clicks when not playing', () => {
    const onCellClick = vi.fn();

    renderWithTheme(
      <GameBoard
        boardLayout={mockBoardLayout}
        selectedNumbers={emptySelectedNumbers}
        nextExpectedNumber={0}
        isPlaying={false}
        onCellClick={onCellClick}
      />
    );

    fireEvent.click(screen.getByText('0'));
    expect(onCellClick).not.toHaveBeenCalled();
  });
});
