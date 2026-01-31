import { useEffect, useRef, useCallback } from 'react';

/**
 * Configuration for the useTimer hook.
 */
export interface UseTimerConfig {
  /** Whether the timer should be running */
  isRunning: boolean;
  /** Current elapsed seconds */
  elapsedSeconds: number;
  /** Optional time limit (for Time Limit mode) */
  timeLimit?: number;
  /** Callback when timer ticks (every second) */
  onTick: () => void;
  /** Callback when time limit is reached */
  onTimeUp?: () => void;
}

/**
 * Custom hook for managing the game timer.
 *
 * @param config - Timer configuration
 */
export function useTimer(config: UseTimerConfig): void {
  const { isRunning, elapsedSeconds, timeLimit, onTick, onTimeUp } = config;

  // Use refs to avoid stale closures in the interval callback
  const onTickRef = useRef(onTick);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Timer effect
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      onTickRef.current();
    }, 1000);

    return (): void => {
      clearInterval(interval);
    };
  }, [isRunning]);

  // Time limit check effect
  useEffect(() => {
    if (!isRunning || timeLimit === undefined) {
      return;
    }

    if (elapsedSeconds >= timeLimit && onTimeUpRef.current) {
      onTimeUpRef.current();
    }
  }, [isRunning, elapsedSeconds, timeLimit]);
}

/**
 * Formats seconds into a display string (e.g., "1:30" for 90 seconds).
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs}s`;
  }

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Hook that returns only the formatTime function for use in components.
 */
export function useTimeFormatter(): (seconds: number) => string {
  return useCallback((seconds: number): string => formatTime(seconds), []);
}
