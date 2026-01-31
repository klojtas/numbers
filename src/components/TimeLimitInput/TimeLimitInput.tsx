import type { JSX } from 'react';
import { TextField } from '@mui/material';
import { GAME_CONSTANTS } from '../../types';

/**
 * Props for the TimeLimitInput component
 */
export interface TimeLimitInputProps {
  /** Current time limit value in seconds */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Whether the input is disabled */
  disabled: boolean;
}

/**
 * TimeLimitInput component for entering the time limit in seconds.
 * Valid range: 10-600 seconds.
 */
export function TimeLimitInput({ value, onChange, disabled }: TimeLimitInputProps): JSX.Element {
  const isValid = value >= GAME_CONSTANTS.MIN_TIME_LIMIT && value <= GAME_CONSTANTS.MAX_TIME_LIMIT;
  const errorMessage = !isValid
    ? value < GAME_CONSTANTS.MIN_TIME_LIMIT
      ? `Minimum is ${GAME_CONSTANTS.MIN_TIME_LIMIT} seconds`
      : `Maximum is ${GAME_CONSTANTS.MAX_TIME_LIMIT} seconds`
    : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <TextField
      type="number"
      label="Time Limit (seconds)"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      error={!isValid}
      helperText={errorMessage}
      size="small"
      slotProps={{
        htmlInput: {
          min: GAME_CONSTANTS.MIN_TIME_LIMIT,
          max: GAME_CONSTANTS.MAX_TIME_LIMIT,
          'aria-label': 'Time limit in seconds',
        },
      }}
      sx={{ width: 160 }}
    />
  );
}
