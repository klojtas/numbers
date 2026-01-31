import type { JSX } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { GameMode } from '../../types';

/**
 * Props for the ModeSelector component
 */
export interface ModeSelectorProps {
  /** Currently selected game mode */
  selectedMode: GameMode;
  /** Callback when mode is changed */
  onModeChange: (mode: GameMode) => void;
  /** Whether the selector is disabled */
  disabled: boolean;
}

/**
 * ModeSelector component allows switching between game modes.
 */
export function ModeSelector({
  selectedMode,
  onModeChange,
  disabled,
}: ModeSelectorProps): JSX.Element {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newMode: GameMode | null): void => {
    if (newMode !== null && newMode !== selectedMode) {
      onModeChange(newMode);
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedMode}
      exclusive
      onChange={handleChange}
      aria-label="Game mode"
      disabled={disabled}
      size="small"
    >
      <ToggleButton value="timeLimit" aria-label="Time Limit mode">
        Time Limit
      </ToggleButton>
      <ToggleButton value="completion" aria-label="Completion mode">
        Completion
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
