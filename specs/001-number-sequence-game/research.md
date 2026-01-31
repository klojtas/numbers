# Research: Number Sequence Game

**Branch**: `001-number-sequence-game` | **Date**: 2026-01-31  
**Purpose**: Document technology decisions, best practices, and research findings for implementation

## Technology Decisions

### 1. Frontend Framework: React 18+

**Decision**: Use React 18 with functional components and hooks

**Rationale**:
- Constitution requires Material Design UI → MUI (Material-UI) is the leading React implementation
- React's component model aligns with game architecture (board, cells, controls, status)
- Hooks enable clean state management without Redux complexity
- Large ecosystem and community support

**Alternatives Considered**:
- Vue 3 + Vuetify - Rejected: MUI has better TypeScript support and larger community
- Svelte - Rejected: Smaller ecosystem, fewer Material Design options
- Vanilla JS - Rejected: Would require building component system, violates simplicity principle

### 2. Build Tool: Vite

**Decision**: Use Vite for development and production builds

**Rationale**:
- Fast development server with HMR (Hot Module Replacement)
- Native TypeScript support without additional configuration
- Optimized production builds for static hosting
- Simple configuration for GitHub Pages deployment
- Built-in support for React

**Alternatives Considered**:
- Create React App - Rejected: Slower, larger bundle, less configurable
- Webpack (manual) - Rejected: Complex configuration, violates simplicity principle
- Parcel - Rejected: Less ecosystem support, fewer plugins

### 3. UI Component Library: Material-UI (MUI) 5+

**Decision**: Use MUI for Material Design components

**Rationale**:
- Constitution requirement: "UI components MUST follow Material Design principles"
- Comprehensive component library (Grid, Button, Typography, Modal)
- Built-in theming system for customization
- Excellent TypeScript support with typed props
- Accessibility built-in (WCAG compliance)

**Key Components to Use**:
- `Grid2` - For 10x10 game board layout
- `Button` - Start/Reset buttons
- `Paper` - Cell containers
- `Typography` - Numbers, labels, status text
- `Dialog` - End-game summary modal
- `Slider` or `TextField` - Time limit configuration
- `ToggleButtonGroup` - Mode selection

### 4. State Management: React Hooks (useState, useReducer)

**Decision**: Use built-in React hooks without external state library

**Rationale**:
- Game state is simple and localized (not shared across unrelated components)
- `useReducer` provides predictable state transitions for game logic
- No server sync needed → no need for TanStack Query or similar
- Constitution principle IV (Simplicity): "Dependencies MUST be minimized"

**State Structure**:
```typescript
interface GameState {
  phase: 'idle' | 'playing' | 'ended';
  mode: 'timeLimit' | 'completion';
  timeLimitSeconds: number;
  elapsedSeconds: number;
  nextExpectedNumber: number;
  selectedNumbers: Set<number>;
  boardLayout: number[]; // Array of 100 numbers in shuffled order
}
```

### 5. Testing: Vitest + React Testing Library

**Decision**: Use Vitest for unit/integration tests, React Testing Library for component tests

**Rationale**:
- Constitution requirement: TDD is mandatory (Principle II)
- Vitest is Vite-native → faster test execution, shared config
- React Testing Library tests user behavior, not implementation
- jsdom environment for DOM testing without browser

**Testing Strategy**:
- Unit tests for utility functions (shuffle, validation)
- Hook tests for game logic (useGame, useTimer)
- Component tests for UI behavior
- Integration tests for complete user flows

### 6. Deployment: Static Files

**Decision**: Build as static files deployable to any static host

**Rationale**:
- FR-026: "Application MUST be hostable as static files"
- FR-028: "Application MUST work without server-side processing"
- GitHub Pages is free and integrates with GitHub workflow

**Deployment Targets**:
1. **Local**: `npm run dev` or `npm run preview`
2. **Docker**: Nginx serving built static files
3. **GitHub Pages**: Automated via GitHub Actions

## Best Practices Research

### React + TypeScript Best Practices

1. **Component Typing**:
   ```typescript
   interface GameCellProps {
     number: number;
     isSelected: boolean;
     isNext: boolean;
     onSelect: (num: number) => void;
   }
   
   export const GameCell: React.FC<GameCellProps> = ({ ... }) => { ... }
   ```

2. **Event Handlers**: Use proper event types
   ```typescript
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => { ... }
   ```

3. **State Updates**: Use functional updates for state that depends on previous state
   ```typescript
   setSelectedNumbers(prev => new Set([...prev, number]));
   ```

### MUI Theming Best Practices

1. **Custom Theme**: Define colors, typography, spacing in theme.ts
2. **sx Prop**: Use for one-off styles, CSS-in-JS for reusable styles
3. **Responsive Design**: Use MUI breakpoints system

### Game Timer Implementation

**Approach**: Use `setInterval` with cleanup in `useEffect`

```typescript
useEffect(() => {
  if (phase !== 'playing') return;
  
  const interval = setInterval(() => {
    setElapsedSeconds(prev => prev + 1);
  }, 1000);
  
  return () => clearInterval(interval);
}, [phase]);
```

**Accuracy Note**: JavaScript timers are not perfectly accurate but sufficient for ±100ms requirement (SC-007). For higher accuracy, use `performance.now()` delta calculations.

### Fisher-Yates Shuffle Algorithm

**Decision**: Use Fisher-Yates for O(n) unbiased shuffling

```typescript
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

### Accessibility Requirements

Per constitution VI and SC-003 (intuitive UI):

1. **Keyboard Navigation**: Tab through cells, Enter/Space to select
2. **ARIA Labels**: Describe cell state (selected, available, locked)
3. **Color Contrast**: Ensure 4.5:1 contrast ratio (WCAG AA)
4. **Focus Indicators**: Visible focus state on interactive elements
5. **Screen Reader**: Announce game state changes

### Docker Configuration

**Multi-stage build for minimal image**:
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Resolved Questions

All technical context was resolved without external clarification:

| Original Unknown | Resolution |
|-----------------|------------|
| (none) | All technologies defined by constitution and spec requirements |

## Summary

The technical stack is fully defined:
- **React 18 + TypeScript** for the application
- **MUI 5** for Material Design components
- **Vite** for fast builds and development
- **Vitest + React Testing Library** for TDD
- **Static deployment** to local, Docker, GitHub Pages

No external research or clarifications needed. Proceed to Phase 1: Design & Contracts.
