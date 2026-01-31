# Data Model: Number Sequence Game

**Branch**: `001-number-sequence-game` | **Date**: 2026-01-31

## Overview

This document defines the data structures and state management for the Number Sequence Game. As a client-side only application with no persistence, all data is transient and managed in React state.

## Entities

### 1. Game State

The central state object managing the entire game.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `phase` | `GamePhase` | Current game lifecycle stage | Must be one of: 'idle', 'playing', 'ended' |
| `mode` | `GameMode` | Selected game mode | Must be one of: 'timeLimit', 'completion' |
| `timeLimitSeconds` | `number` | Time limit for Time Limit mode | 10 ≤ value ≤ 600 (FR-020) |
| `elapsedSeconds` | `number` | Seconds since game started | value ≥ 0 |
| `nextExpectedNumber` | `number` | The next number player must select | 0 ≤ value ≤ 99 |
| `selectedNumbers` | `Set<number>` | Numbers successfully selected | All values 0-99, no duplicates |
| `boardLayout` | `number[]` | Array of 100 numbers in board order | Length = 100, contains 0-99 exactly once each |

**State Transitions**:

```
[idle] --Start--> [playing] --TimeUp/Complete--> [ended]
  ^                                                |
  |                    Reset                       |
  +------------------------------------------------+
```

### 2. Game Mode

Enumeration of available game modes.

| Value | Description |
|-------|-------------|
| `'timeLimit'` | Game ends when timer reaches configured limit |
| `'completion'` | Game ends when all 100 numbers are found |

### 3. Game Phase

Enumeration of game lifecycle phases.

| Value | Description | Start Enabled | Reset Enabled | Board Interactive |
|-------|-------------|---------------|---------------|-------------------|
| `'idle'` | Initial state, no game in progress | Yes | No | No |
| `'playing'` | Game active, timer running | No | Yes | Yes |
| `'ended'` | Game finished (time up or completed) | No | Yes | No |

### 4. Game Result

Statistics shown at end of game.

| Field | Type | Description | When Shown |
|-------|------|-------------|------------|
| `numbersFound` | `number` | Count of numbers successfully selected | Time Limit mode |
| `totalTime` | `number` | Seconds taken to complete | Completion mode |
| `mode` | `GameMode` | The mode that was played | Both modes |
| `isVictory` | `boolean` | True if player completed all numbers | Both modes |

### 5. Cell State

Derived state for individual board cells (computed, not stored).

| Field | Type | Description |
|-------|------|-------------|
| `number` | `number` | The number displayed in this cell (0-99) |
| `isSelected` | `boolean` | Whether this number has been found |
| `isNext` | `boolean` | Whether this is the next expected number |
| `position` | `number` | Index position on board (0-99) |

## Relationships

```
┌─────────────────────────────────────────────────────────┐
│                      GameState                          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │  GameMode  │  │ GamePhase  │  │   boardLayout   │   │
│  │ (enum)     │  │ (enum)     │  │   number[100]   │   │
│  └────────────┘  └────────────┘  └────────┬────────┘   │
│                                           │            │
│  ┌─────────────────┐                      │            │
│  │ selectedNumbers │                      │            │
│  │   Set<number>   │                      │            │
│  └────────┬────────┘                      │            │
│           │                               │            │
│           └───────────┬───────────────────┘            │
│                       ▼                                │
│           ┌─────────────────────┐                      │
│           │  CellState (derived)│                      │
│           │  computed per cell  │                      │
│           └─────────────────────┘                      │
│                       │                                │
│                       ▼                                │
│           ┌─────────────────────┐                      │
│           │    GameResult       │                      │
│           │ (computed at end)   │                      │
│           └─────────────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

## Initial State

```typescript
const INITIAL_STATE: GameState = {
  phase: 'idle',
  mode: 'timeLimit',           // Default mode per spec
  timeLimitSeconds: 100,       // Default per FR-019
  elapsedSeconds: 0,
  nextExpectedNumber: 0,       // Start with 0
  selectedNumbers: new Set(),
  boardLayout: [],             // Empty until Start is pressed
};
```

## State Actions

| Action | Trigger | State Changes |
|--------|---------|---------------|
| `START_GAME` | Start button click | phase → 'playing', boardLayout → shuffled 0-99, reset counters |
| `SELECT_NUMBER` | Cell click (correct) | selectedNumbers += number, nextExpectedNumber += 1 |
| `WRONG_NUMBER` | Cell click (incorrect) | No state change (only triggers UI feedback) |
| `TICK` | Timer interval (1s) | elapsedSeconds += 1 |
| `TIME_UP` | elapsedSeconds >= timeLimitSeconds | phase → 'ended' |
| `COMPLETE` | nextExpectedNumber > 99 | phase → 'ended' |
| `RESET` | Reset button click | Return to INITIAL_STATE (preserve mode/timeLimit settings) |
| `SET_MODE` | Mode selector change | mode → selected value |
| `SET_TIME_LIMIT` | Time limit input change | timeLimitSeconds → validated value |

## Validation Rules

### Time Limit Input (FR-020)
- Minimum: 10 seconds
- Maximum: 600 seconds (10 minutes)
- Default: 100 seconds
- Non-integer values: Round to nearest integer
- Invalid/empty: Revert to previous valid value

### Number Selection (FR-009)
- Only accept if `clickedNumber === nextExpectedNumber`
- Reject clicks on already-selected numbers
- Reject clicks when phase !== 'playing'

### Board Generation (FR-002, FR-003)
- Must contain exactly numbers 0-99
- Must be randomly shuffled (Fisher-Yates)
- Each number appears exactly once

## Computed Values

### Score (Time Limit mode)
```typescript
const score = selectedNumbers.size; // How many numbers found
```

### Progress Percentage
```typescript
const progress = (selectedNumbers.size / 100) * 100; // 0-100%
```

### Is Victory
```typescript
const isVictory = nextExpectedNumber > 99; // Found all 100 numbers
```

### Game Result
```typescript
const gameResult: GameResult = {
  numbersFound: selectedNumbers.size,
  totalTime: elapsedSeconds,
  mode: mode,
  isVictory: nextExpectedNumber > 99,
};
```

## UI State Derivation

For each cell at position `i`:
```typescript
const cellState: CellState = {
  number: boardLayout[i],
  isSelected: selectedNumbers.has(boardLayout[i]),
  isNext: boardLayout[i] === nextExpectedNumber,
  position: i,
};
```
