import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/theme';
import { TimeLimitInput } from '../../src/components/TimeLimitInput';

/**
 * Test helper to render components with MUI theme
 */
function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('TimeLimitInput', () => {
  it('should render input field', () => {
    renderWithTheme(<TimeLimitInput value={60} onChange={vi.fn()} disabled={false} />);

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should display current value', () => {
    renderWithTheme(<TimeLimitInput value={120} onChange={vi.fn()} disabled={false} />);

    expect(screen.getByRole('spinbutton')).toHaveValue(120);
  });

  it('should show label "Time Limit (seconds)"', () => {
    renderWithTheme(<TimeLimitInput value={60} onChange={vi.fn()} disabled={false} />);

    expect(screen.getByLabelText(/time limit/i)).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const onChange = vi.fn();
    renderWithTheme(<TimeLimitInput value={60} onChange={onChange} disabled={false} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '90' } });

    expect(onChange).toHaveBeenCalledWith(90);
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithTheme(<TimeLimitInput value={60} onChange={vi.fn()} disabled={true} />);

    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('should show error for values below minimum (10)', () => {
    const onChange = vi.fn();
    renderWithTheme(<TimeLimitInput value={5} onChange={onChange} disabled={false} />);

    expect(screen.getByText(/minimum.*10/i)).toBeInTheDocument();
  });

  it('should show error for values above maximum (600)', () => {
    const onChange = vi.fn();
    renderWithTheme(<TimeLimitInput value={700} onChange={onChange} disabled={false} />);

    expect(screen.getByText(/maximum.*600/i)).toBeInTheDocument();
  });

  it('should not show error for valid values', () => {
    renderWithTheme(<TimeLimitInput value={60} onChange={vi.fn()} disabled={false} />);

    expect(screen.queryByText(/minimum|maximum/i)).not.toBeInTheDocument();
  });

  it('should have min attribute set to 10', () => {
    renderWithTheme(<TimeLimitInput value={60} onChange={vi.fn()} disabled={false} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '10');
  });

  it('should have max attribute set to 600', () => {
    renderWithTheme(<TimeLimitInput value={60} onChange={vi.fn()} disabled={false} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('max', '600');
  });
});
