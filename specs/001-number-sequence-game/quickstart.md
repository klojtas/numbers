# Quickstart Guide: Number Sequence Game

**Branch**: `001-number-sequence-game` | **Date**: 2026-01-31

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (included with Node.js)
- **Docker** (optional, for containerized deployment)
- **Git** (for version control)

## Initial Project Setup

### 1. Create the Project

```bash
# Navigate to repository root
cd /path/to/numbers

# Create Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install MUI and dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Install dev dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
```

### 2. Configure TypeScript (Strict Mode)

Update `tsconfig.json` to match constitution requirements:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 3. Configure ESLint

Create/update `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-refresh"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 4. Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

## Development Commands

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start development server (localhost:5173) |
| `npm run build`     | Build for production                      |
| `npm run preview`   | Preview production build locally          |
| `npm run test`      | Run tests in watch mode                   |
| `npm run test:run`  | Run tests once                            |
| `npm run lint`      | Run ESLint                                |
| `npm run format`    | Run Prettier                              |
| `npm run typecheck` | Run TypeScript compiler check             |

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write src/",
    "typecheck": "tsc --noEmit"
  }
}
```

## TDD Workflow

Per constitution principle II (Test-First Development):

### 1. Write Failing Test First

```typescript
// tests/utils/shuffle.test.ts
import { describe, it, expect } from 'vitest';
import { shuffleArray } from '../../src/utils/shuffle';

describe('shuffleArray', () => {
  it('should return array with same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
  });

  it('should contain all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
  });
});
```

### 2. Run Test (Should Fail - Red)

```bash
npm run test:run
```

### 3. Write Minimal Implementation (Green)

```typescript
// src/utils/shuffle.ts
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

### 4. Run Test Again (Should Pass)

```bash
npm run test:run
```

### 5. Refactor if Needed

## Deployment

### Local Development

```bash
npm run dev
# Open http://localhost:5173
```

### Docker

Build and run:

```bash
# Build image
docker build -t numbers-game .

# Run container
docker run -p 8080:80 numbers-game

# Open http://localhost:8080
```

### GitHub Pages

1. Configure `vite.config.ts` for GitHub Pages base path:

```typescript
export default defineConfig({
  base: '/numbers/', // Replace with your repo name
  plugins: [react()],
});
```

2. Create GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. Enable GitHub Pages in repository settings (use gh-pages branch).

## Directory Structure After Setup

```
numbers/
├── .github/
│   └── workflows/
│       ├── validate-constitution.yml
│       └── deploy.yml
├── .specify/
│   └── memory/
│       └── constitution.md
├── specs/
│   └── 001-number-sequence-game/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       └── contracts/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── theme.ts
├── tests/
│   ├── setup.ts
│   ├── components/
│   ├── hooks/
│   └── utils/
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.json
├── .prettierrc.json
├── Dockerfile
└── README.md
```

## Next Steps

After setup, proceed with `/speckit.tasks` to generate implementation tasks following TDD.
