# Tasks: Number Sequence Game

**Input**: Design documents from `/specs/001-number-sequence-game/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Following TDD per constitution - tests written BEFORE implementation (NON-NEGOTIABLE).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US5) for traceability

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create project structure with React + TypeScript + Vite + MUI

- [x] T001 Initialize Vite React TypeScript project at repository root
- [x] T002 [P] Install MUI dependencies (@mui/material, @emotion/react, @emotion/styled)
- [x] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T004 [P] Configure ESLint with TypeScript rules in .eslintrc.json
- [x] T005 [P] Configure Prettier in .prettierrc.json
- [x] T006 [P] Configure Vitest with React Testing Library in vitest.config.ts
- [x] T007 Create project directory structure per plan.md (src/components, src/hooks, src/types, src/utils, tests/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, theme, and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 [P] Copy contract types from specs/001-number-sequence-game/contracts/ to src/types/
- [x] T009 [P] Create MUI theme configuration in src/theme.ts with Material Design colors
- [x] T010 [P] Implement Fisher-Yates shuffle utility in src/utils/shuffle.ts
- [x] T011 [P] Write unit tests for shuffle in tests/utils/shuffle.test.ts
- [x] T012 [P] Implement time limit validation utility in src/utils/validation.ts
- [x] T013 [P] Write unit tests for validation in tests/utils/validation.test.ts
- [x] T014 Create useTimer hook in src/hooks/useTimer.ts
- [x] T015 Write tests for useTimer hook in tests/hooks/useTimer.test.ts
- [x] T016 Create useGame hook with state reducer in src/hooks/useGame.ts
- [x] T017 Write tests for useGame hook in tests/hooks/useGame.test.ts

**Checkpoint**: Foundation ready - all types, hooks, and utilities available

---

## Phase 3: User Story 1 - Play Basic Number Selection Game (Priority: P1) 🎯 MVP

**Goal**: 10x10 board with numbers 0-99, click numbers in ascending order, timer and "Last Selected" display

**Independent Test**: Load game → Start → Click 0,1,2... → See timer counting, cells marking selected, wrong clicks show error feedback

### Tests for User Story 1 (TDD - Write First, Must Fail)

- [x] T018 [P] [US1] Write GameCell component tests in tests/components/GameCell.test.tsx
- [x] T019 [P] [US1] Write GameBoard component tests in tests/components/GameBoard.test.tsx
- [x] T020 [P] [US1] Write GameStatus component tests in tests/components/GameStatus.test.tsx
- [x] T021 [P] [US1] Write integration test for basic game flow in tests/integration/basicGame.test.tsx

### Implementation for User Story 1

- [x] T022 [P] [US1] Create GameCell component in src/components/GameCell/GameCell.tsx (number display, selected/error states)
- [x] T023 [P] [US1] Create GameCell styles with MUI sx props (includes error animation ~200ms)
- [x] T024 [US1] Create GameBoard component in src/components/GameBoard/GameBoard.tsx (10x10 grid using MUI Grid)
- [x] T025 [US1] Create GameStatus component in src/components/GameStatus/GameStatus.tsx (timer + last selected display)
- [x] T026 [US1] Create basic App.tsx with GameBoard, GameStatus, and Start button
- [x] T027 [US1] Wire up useGame hook to App for state management
- [x] T028 [US1] Implement number selection logic (validate next expected, mark selected)
- [x] T029 [US1] Implement error feedback animation for wrong number clicks

**Checkpoint**: User Story 1 complete - basic game is playable with timer and feedback ✅

---

## Phase 4: User Story 4 - Reset Game (Priority: P1)

**Goal**: Reset button clears game state, allows restarting

**Independent Test**: Start game → Select some numbers → Reset → Board clears, timer resets, Start enabled

### Tests for User Story 4 (TDD - Write First, Must Fail)

- [x] T030 [P] [US4] Write GameControls component tests in tests/components/GameControls.test.tsx
- [x] T031 [P] [US4] Write integration test for reset flow in tests/integration/resetGame.test.tsx

### Implementation for User Story 4

- [x] T032 [US4] Create GameControls component in src/components/GameControls/GameControls.tsx (Start/Reset buttons)
- [x] T033 [US4] Implement Start button state (disabled during playing phase)
- [x] T034 [US4] Implement Reset button state (disabled when idle, enabled during playing/ended)
- [x] T035 [US4] Wire RESET action in useGame to clear state and preserve mode settings
- [x] T036 [US4] Update App.tsx to use GameControls component

**Checkpoint**: User Stories 1 & 4 complete - game is fully playable with start/reset cycle ✅

---

## Phase 5: User Story 2 - Time Limit Mode (Priority: P2)

**Goal**: Game ends after configured time, shows score

**Independent Test**: Set time limit → Start → Wait for timeout → See "Time's up! You found X numbers"

### Tests for User Story 2 (TDD - Write First, Must Fail)

- [x] T037 [P] [US2] Write ModeSelector component tests in tests/components/ModeSelector.test.tsx
- [x] T038 [P] [US2] Write TimeLimitInput component tests in tests/components/TimeLimitInput.test.tsx
- [x] T039 [P] [US2] Write GameSummary component tests in tests/components/GameSummary.test.tsx
- [x] T040 [P] [US2] Write integration test for time limit mode in tests/integration/timeLimitMode.test.tsx

### Implementation for User Story 2

- [x] T041 [P] [US2] Create ModeSelector component in src/components/ModeSelector/ModeSelector.tsx (toggle between modes)
- [x] T042 [P] [US2] Create TimeLimitInput component in src/components/TimeLimitInput/TimeLimitInput.tsx (10-600s input)
- [x] T043 [US2] Create GameSummary component in src/components/GameSummary/GameSummary.tsx (MUI Dialog for results)
- [x] T044 [US2] Implement TIME_UP action in useGame to end game when timer reaches limit
- [x] T045 [US2] Wire time limit check in useTimer to dispatch TIME_UP
- [x] T046 [US2] Display Time Limit mode result message ("You found X out of 100 numbers")
- [x] T047 [US2] Update App.tsx to include ModeSelector and TimeLimitInput

**Checkpoint**: User Story 2 complete - Time Limit mode fully functional ✅

---

## Phase 6: User Story 3 - Completion Mode (Priority: P2)

**Goal**: Game ends when all 100 numbers found, shows completion time

**Independent Test**: Select Completion mode → Start → Find all numbers 0-99 → See "Completed! Your time: X seconds"

### Tests for User Story 3 (TDD - Write First, Must Fail)

- [x] T048 [P] [US3] Write integration test for completion mode in tests/integration/completionMode.test.tsx

### Implementation for User Story 3

- [x] T049 [US3] Implement COMPLETE action in useGame when nextExpectedNumber > 99
- [x] T050 [US3] Update GameSummary to display Completion mode result ("Completed! Your time: X seconds")
- [x] T051 [US3] Ensure mode selector properly switches between Time Limit and Completion
- [x] T052 [US3] Hide time limit input when Completion mode is selected

**Checkpoint**: User Stories 1-4 complete - both game modes fully functional ✅

---

## Phase 7: User Story 5 - Host Game on Multiple Platforms (Priority: P3)

**Goal**: Deployable locally, in Docker, and on GitHub Pages

**Independent Test**: Build → Deploy to each target → Verify game loads and works

### Tests for User Story 5

- [x] T053 [P] [US5] Verify npm run build produces valid static files
- [x] T054 [P] [US5] Verify Docker build completes successfully

### Implementation for User Story 5

- [x] T055 [P] [US5] Create Dockerfile with multi-stage build (node:alpine → nginx:alpine)
- [x] T056 [P] [US5] Create docker-compose.yml for easy local container deployment
- [x] T057 [P] [US5] Configure vite.config.ts base path for GitHub Pages
- [x] T058 [P] [US5] Create .github/workflows/deploy.yml for GitHub Pages deployment
- [x] T059 [US5] Update README.md with deployment instructions for all three targets
- [x] T060 [US5] Test local development server (npm run dev)
- [x] T061 [US5] Test Docker deployment (docker build && docker run)

**Checkpoint**: All user stories complete - game deployable everywhere ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final quality improvements

- [x] T062 [P] Add responsive styles for mobile (≥320px width per SC-004)
- [x] T063 [P] Add ARIA labels for accessibility (WCAG 2.1 AA)
- [x] T064 [P] Add keyboard navigation support (Tab through cells, Enter to select)
- [x] T065 [P] Create favicon.ico and update index.html title
- [x] T066 Run full ESLint check and fix any warnings
- [x] T067 Run full Prettier format check
- [x] T068 Run tsc --noEmit to verify no type errors
- [x] T069 Run all tests and verify 100% pass rate
- [x] T070 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → [All User Stories can parallelize]
                                         ↓
                    ┌────────────────────┼────────────────────┐
                    ↓                    ↓                    ↓
              Phase 3 (US1 P1)    Phase 5 (US2 P2)    Phase 7 (US5 P3)
                    ↓                    ↓
              Phase 4 (US4 P1)    Phase 6 (US3 P2)
                    └────────────────────┴────────────────────┘
                                         ↓
                                  Phase 8 (Polish)
```

### User Story Dependencies

| Story            | Depends On                         | Can Parallelize With      |
| ---------------- | ---------------------------------- | ------------------------- |
| US1 (Basic Game) | Foundational                       | -                         |
| US4 (Reset)      | US1 components                     | US2, US3, US5 (after US1) |
| US2 (Time Limit) | Foundational                       | US3, US5                  |
| US3 (Completion) | Foundational, GameSummary from US2 | US5                       |
| US5 (Deployment) | Foundational                       | US2, US3                  |

### Within Each User Story (TDD Flow)

1. Write tests → Must FAIL (Red)
2. Implement components → Tests PASS (Green)
3. Refactor if needed → Tests still PASS
4. Story checkpoint → Independently testable

---

## Parallel Execution Examples

### Phase 2 (Foundational) - All [P] tasks at once:

```
T008: Copy contract types
T009: Create MUI theme
T010: Implement shuffle utility
T011: Write shuffle tests
T012: Implement validation utility
T013: Write validation tests
```

### Phase 3 (US1) - Tests first, then components:

```
# Step 1: Write all tests (parallel)
T018, T019, T020, T021

# Step 2: Implement components (parallel where possible)
T022, T023 (parallel - different files)
T024 (depends on T022)
T025 (parallel with T024)
T026-T029 (sequential - integration)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 4)

1. Complete Phase 1: Setup ✓
2. Complete Phase 2: Foundational ✓
3. Complete Phase 3: User Story 1 (Basic Game)
4. Complete Phase 4: User Story 4 (Reset)
5. **STOP**: Test MVP - game is fully playable with basic mechanics
6. Deploy MVP if ready

### Incremental Delivery

| Increment | Stories   | Value Delivered                |
| --------- | --------- | ------------------------------ |
| MVP       | US1 + US4 | Playable game with start/reset |
| +Modes    | US2 + US3 | Both game modes functional     |
| +Deploy   | US5       | Accessible on all platforms    |
| +Polish   | Phase 8   | Production-ready quality       |

---

## Summary

| Phase        | Tasks     | Parallel Opportunities          |
| ------------ | --------- | ------------------------------- |
| Setup        | T001-T007 | T002-T006                       |
| Foundational | T008-T017 | T008-T013                       |
| US1 (P1)     | T018-T029 | T018-T021, T022-T023, T024-T025 |
| US4 (P1)     | T030-T036 | T030-T031                       |
| US2 (P2)     | T037-T047 | T037-T042                       |
| US3 (P2)     | T048-T052 | -                               |
| US5 (P3)     | T053-T061 | T053-T058                       |
| Polish       | T062-T070 | T062-T065                       |

**Total Tasks**: 70  
**Tasks per Story**: US1(12), US4(7), US2(11), US3(5), US5(9)  
**Parallel Opportunities**: 45+ tasks can run in parallel within their phases
