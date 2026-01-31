import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/theme';
import { ModeSelector } from '../../src/components/ModeSelector';

/**
 * Test helper to render components with MUI theme
 */
function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('ModeSelector', () => {
  it('should render mode selector', () => {
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={vi.fn()} disabled={false} />
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('should render Time Limit option', () => {
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={vi.fn()} disabled={false} />
    );

    expect(screen.getByText(/time limit/i)).toBeInTheDocument();
  });

  it('should render Completion option', () => {
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={vi.fn()} disabled={false} />
    );

    expect(screen.getByText(/completion/i)).toBeInTheDocument();
  });

  it('should show Time Limit as selected when mode is timeLimit', () => {
    renderWithTheme(
      <ModeSelector selectedMode="timeLimit" onModeChange={vi.fn()} disabled={false} />
    );

    const timeLimitButton = screen.getByRole('button', { pressed: true });
    expect(timeLimitButton).toHaveTextContent(/time limit/i);
  });

  it('should show Completion as selected when mode is completion', () => {
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={vi.fn()} disabled={false} />
    );

    const completionButton = screen.getByRole('button', { pressed: true });
    expect(completionButton).toHaveTextContent(/completion/i);
  });

  it('should call onModeChange when mode is changed', () => {
    const onModeChange = vi.fn();
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={onModeChange} disabled={false} />
    );

    const timeLimitButton = screen.getByRole('button', { name: /time limit/i });
    fireEvent.click(timeLimitButton);

    expect(onModeChange).toHaveBeenCalledWith('timeLimit');
  });

  it('should not call onModeChange when clicking already selected mode', () => {
    const onModeChange = vi.fn();
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={onModeChange} disabled={false} />
    );

    const completionButton = screen.getByRole('button', { pressed: true });
    fireEvent.click(completionButton);

    expect(onModeChange).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={vi.fn()} disabled={true} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should not call onModeChange when disabled', () => {
    const onModeChange = vi.fn();
    renderWithTheme(
      <ModeSelector selectedMode="completion" onModeChange={onModeChange} disabled={true} />
    );

    const timeLimitButton = screen.getByRole('button', { name: /time limit/i });
    fireEvent.click(timeLimitButton);

    expect(onModeChange).not.toHaveBeenCalled();
  });
});
