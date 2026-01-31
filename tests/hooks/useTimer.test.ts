import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer, formatTime } from '../../src/hooks/useTimer';

describe('formatTime', () => {
  it('should format seconds only when under a minute', () => {
    expect(formatTime(0)).toBe('0s');
    expect(formatTime(30)).toBe('30s');
    expect(formatTime(59)).toBe('59s');
  });

  it('should format minutes and seconds', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(125)).toBe('2:05');
  });

  it('should pad seconds with zero when needed', () => {
    expect(formatTime(61)).toBe('1:01');
    expect(formatTime(69)).toBe('1:09');
  });
});

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not tick when not running', () => {
    const onTick = vi.fn();

    renderHook(() =>
      useTimer({
        isRunning: false,
        elapsedSeconds: 0,
        onTick,
      })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onTick).not.toHaveBeenCalled();
  });

  it('should tick every second when running', () => {
    const onTick = vi.fn();

    renderHook(() =>
      useTimer({
        isRunning: true,
        elapsedSeconds: 0,
        onTick,
      })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onTick).toHaveBeenCalledTimes(3);
  });

  it('should stop ticking when isRunning becomes false', () => {
    const onTick = vi.fn();

    const { rerender } = renderHook(
      ({ isRunning }) =>
        useTimer({
          isRunning,
          elapsedSeconds: 0,
          onTick,
        }),
      { initialProps: { isRunning: true } }
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onTick).toHaveBeenCalledTimes(2);

    rerender({ isRunning: false });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should still be 2, no more ticks
    expect(onTick).toHaveBeenCalledTimes(2);
  });

  it('should call onTimeUp when elapsed reaches time limit', () => {
    const onTick = vi.fn();
    const onTimeUp = vi.fn();

    renderHook(() =>
      useTimer({
        isRunning: true,
        elapsedSeconds: 100,
        timeLimit: 100,
        onTick,
        onTimeUp,
      })
    );

    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('should not call onTimeUp when elapsed is below time limit', () => {
    const onTick = vi.fn();
    const onTimeUp = vi.fn();

    renderHook(() =>
      useTimer({
        isRunning: true,
        elapsedSeconds: 50,
        timeLimit: 100,
        onTick,
        onTimeUp,
      })
    );

    expect(onTimeUp).not.toHaveBeenCalled();
  });

  it('should not call onTimeUp in completion mode (no time limit)', () => {
    const onTick = vi.fn();
    const onTimeUp = vi.fn();

    renderHook(() =>
      useTimer({
        isRunning: true,
        elapsedSeconds: 1000,
        onTick,
        onTimeUp,
      })
    );

    expect(onTimeUp).not.toHaveBeenCalled();
  });
});
