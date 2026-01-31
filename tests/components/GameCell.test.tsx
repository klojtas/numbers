import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { GameCell } from '../../src/components/GameCell/GameCell';
import { theme } from '../../src/theme';

const renderWithTheme = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('GameCell', () => {
  it('should render the number', () => {
    renderWithTheme(
      <GameCell number={42} isSelected={false} isClickable={true} onSelect={vi.fn()} />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should call onSelect when clicked and clickable', () => {
    const onSelect = vi.fn();
    renderWithTheme(
      <GameCell number={42} isSelected={false} isClickable={true} onSelect={onSelect} />
    );

    fireEvent.click(screen.getByText('42'));
    expect(onSelect).toHaveBeenCalledWith(42);
  });

  it('should not call onSelect when not clickable', () => {
    const onSelect = vi.fn();
    renderWithTheme(
      <GameCell number={42} isSelected={false} isClickable={false} onSelect={onSelect} />
    );

    fireEvent.click(screen.getByText('42'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should show selected state visually', () => {
    renderWithTheme(
      <GameCell number={42} isSelected={true} isClickable={false} onSelect={vi.fn()} />
    );

    const cell = screen.getByText('42').closest('div');
    expect(cell).toHaveAttribute('data-selected', 'true');
  });

  it('should show error state when triggered', () => {
    const { rerender } = renderWithTheme(
      <GameCell
        number={42}
        isSelected={false}
        isClickable={true}
        onSelect={vi.fn()}
        showError={false}
      />
    );

    rerender(
      <ThemeProvider theme={theme}>
        <GameCell
          number={42}
          isSelected={false}
          isClickable={true}
          onSelect={vi.fn()}
          showError={true}
        />
      </ThemeProvider>
    );

    const cell = screen.getByText('42').closest('div');
    expect(cell).toHaveAttribute('data-error', 'true');
  });

  it('should be accessible with proper aria attributes', () => {
    renderWithTheme(
      <GameCell number={42} isSelected={false} isClickable={true} onSelect={vi.fn()} />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Select number 42');
  });
});
