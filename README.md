# Number Sequence Game

A web-based cognitive training game where players find numbers 0-99 in sequence on a randomized 10x10 board.

## Features

- **Two Game Modes:**
  - **Time Limit Mode**: Race against the clock! Find as many numbers as possible before time runs out.
  - **Completion Mode**: No time pressure - see how fast you can find all 100 numbers.

- **Responsive Design**: Works on desktop and mobile devices (320px minimum width)
- **Accessible**: Full keyboard navigation and ARIA labels for screen readers

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up --build

# Or build and run manually
docker build -t number-sequence-game .
docker run -p 8080:80 number-sequence-game
```

The game will be available at `http://localhost:8080`

### GitHub Pages

This project is automatically deployed to GitHub Pages on push to the `main` branch.

To manually deploy:
1. Ensure the repository is configured for GitHub Pages
2. Push to the `main` branch
3. The GitHub Actions workflow will build and deploy automatically

## Development

### Tech Stack

- **Frontend**: React 18+ with TypeScript
- **UI Components**: Material-UI (MUI) 5+
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

### Project Structure

```
src/
├── components/          # React components
│   ├── GameBoard/       # 10x10 grid of cells
│   ├── GameCell/        # Individual cell with animations
│   ├── GameControls/    # Start/Reset buttons
│   ├── GameStatus/      # Timer and last selected number
│   ├── GameSummary/     # End-game dialog
│   ├── ModeSelector/    # Time Limit/Completion toggle
│   └── TimeLimitInput/  # Time limit configuration
├── hooks/               # Custom React hooks
│   ├── useGame.ts       # Game state management
│   └── useTimer.ts      # Timer logic
├── types/               # TypeScript types and interfaces
└── utils/               # Utility functions
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |

## License

MIT
