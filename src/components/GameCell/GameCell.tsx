import type { JSX } from 'react';
import { memo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

/**
 * Props for the GameCell component.
 */
export interface GameCellProps {
  /** The number to display (0-99) */
  number: number;
  /** Whether this cell has been selected/found */
  isSelected: boolean;
  /** Whether this cell can be clicked */
  isClickable: boolean;
  /** Callback when cell is clicked */
  onSelect: (number: number) => void;
  /** Whether to show error animation */
  showError?: boolean;
}

// Error shake animation
const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

/**
 * Individual cell component for the game board.
 * Displays a number and handles selection.
 */
export const GameCell = memo(function GameCell({
  number,
  isSelected,
  isClickable,
  onSelect,
  showError = false,
}: GameCellProps): JSX.Element {
  const handleClick = useCallback((): void => {
    if (isClickable) {
      onSelect(number);
    }
  }, [isClickable, number, onSelect]);

  return (
    <Box
      role="button"
      tabIndex={isClickable ? 0 : -1}
      aria-label={`Select number ${number}`}
      aria-pressed={isSelected}
      data-selected={isSelected ? 'true' : 'false'}
      data-error={showError ? 'true' : 'false'}
      onClick={handleClick}
      onKeyDown={(e): void => {
        if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
          e.preventDefault();
          onSelect(number);
        }
      }}
      sx={{
        width: { xs: 32, sm: 40, md: 48 },
        height: { xs: 32, sm: 40, md: 48 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        cursor: isClickable ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'all 0.15s ease-in-out',
        backgroundColor: isSelected
          ? 'success.light'
          : showError
            ? 'error.light'
            : 'background.paper',
        border: '1px solid',
        borderColor: isSelected ? 'success.main' : showError ? 'error.main' : 'divider',
        animation: showError ? `${shakeAnimation} 0.2s ease-in-out` : 'none',
        '&:hover': isClickable
          ? {
              backgroundColor: isSelected ? 'success.light' : 'primary.light',
              borderColor: isSelected ? 'success.main' : 'primary.main',
              transform: 'scale(1.05)',
            }
          : {},
        '&:focus': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
      }}
    >
      <Typography
        variant="body2"
        fontWeight={isSelected ? 600 : 500}
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
          color: isSelected ? 'success.contrastText' : 'text.primary',
          opacity: isSelected ? 0.7 : 1,
        }}
      >
        {number}
      </Typography>
    </Box>
  );
});
