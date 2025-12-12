# Chess Review Site - Project Structure

## Overview
Chess Review Site is a web-based chess game analyzer that allows users to input PGN (Portable Game Notation) and receive detailed analysis of their games using the Stockfish chess engine. The application provides move-by-move evaluation, opening detection, and visual feedback through an interactive chessboard.

## Technology Stack

### Frontend
- **React** (v19.2.0) - UI framework
- **Vite** (v7.2.4) - Build tool and development server
- **chess.js** (v1.4.0) - Chess move validation and game logic
- **react-chessboard** (v5.8.4) - Interactive chessboard component
- **Stockfish.js** - Chess engine running in Web Worker
- **ESLint** (v9.39.1) - Code linting and quality

### Build & Development
- **Node.js** - Runtime environment
- **npm** - Package manager
- **GitHub Pages** - Deployment platform (configured with base path `/chessReviewSite/`)

## Directory Structure

```
chessReviewSite/
├── .git/                      # Git version control
├── .gitignore                 # Git ignore rules (node_modules, dist, .vite, .env)
├── PROJECT_STRUCTURE.md       # This file
└── frontend/                  # Main application directory
    ├── dist/                  # Production build output (generated)
    ├── public/                # Static assets
    │   └── vite.svg          # Vite logo
    ├── src/                   # Source code
    │   ├── analysis/         # Game analysis logic
    │   ├── assets/           # Static assets (images, icons)
    │   ├── components/       # React UI components
    │   ├── engine/           # Stockfish engine integration
    │   ├── hooks/            # React custom hooks
    │   ├── App.jsx           # Main application component
    │   ├── App.css           # Main application styles
    │   ├── main.jsx          # Application entry point
    │   └── index.css         # Global styles
    ├── index.html            # HTML template
    ├── package.json          # Dependencies and scripts
    ├── package-lock.json     # Locked dependency versions
    ├── vite.config.js        # Vite configuration
    ├── eslint.config.js      # ESLint configuration
    └── README.md             # Frontend-specific documentation
```

## Core Modules

### 1. Analysis Module (`src/analysis/`)
Handles chess game analysis and opening detection.

#### Files:
- **`pgnParser.js`**
  - Parses PGN notation into structured move data
  - Validates chess games using chess.js
  - Extracts FEN positions for each move
  - Returns: `{ moves, error }`

- **`openingDetector.js`**
  - Matches played moves against ECO database
  - Identifies chess openings by name and code
  - Returns: `{ eco, name, variation, movesMatched }`

- **`eco.json`**
  - Encyclopedia of Chess Openings (ECO) database
  - Contains opening names, variations, and move sequences

- **`classifier.js`**
  - Move classification logic (planned/stub)
  - Categorizes moves (brilliant, good, inaccuracy, mistake, blunder)

- **`accuracy.js`**
  - Calculates move accuracy (planned/stub)
  - Compares player moves to engine suggestions

- **`explanations.js`**
  - Generates human-readable move explanations (planned/stub)
  - Provides analysis commentary

### 2. Components (`src/components/`)
React UI components for the application interface.

#### Files:
- **`Header.jsx`**
  - Application header and branding
  - Navigation elements

- **`PgnInput.jsx`**
  - PGN input form
  - Game analysis trigger
  - Integrates with Stockfish for position evaluation

- **`ChessboardView.jsx`**
  - Interactive chessboard display
  - Uses react-chessboard library
  - Shows current position based on move index
  - Integrates EvaluationBar component

- **`EvaluationBar.jsx`**
  - Visual representation of position evaluation
  - Shows advantage for white/black based on centipawn score
  - Displays mate-in-X when applicable

- **`MoveList.jsx`**
  - Displays list of all moves in the game
  - Allows navigation between moves
  - Shows move notation in standard algebraic notation (SAN)

- **`AnalysisPanel.jsx`**
  - Main analysis interface
  - Contains PGN input, move list, and controls
  - Manages playback functionality
  - Switches between Moves and Accuracy tabs

- **`GameControlPanel.jsx`**
  - Navigation controls (first, previous, next, last move)
  - Reset button to clear the game
  - Move counter display

- **`SummaryPanel.jsx`**
  - Game summary and statistics
  - Opening information display
  - Analysis results overview

- **`Loader.jsx`**
  - Loading indicator component
  - Shows during engine initialization or analysis

### 3. Engine Module (`src/engine/`)
Stockfish chess engine integration and management.

#### Files:
- **`EngineService.js`**
  - Singleton service for Stockfish engine
  - Manages Web Worker communication
  - Handles UCI protocol commands
  - Methods:
    - `init(options)` - Initialize engine worker
    - `evaluate(fen, depth)` - Evaluate position
    - `getBestMove(fen, depth)` - Get best move
    - `stop()` - Stop current search
    - `terminate()` - Cleanup engine

- **`stockfish.js`**
  - Stockfish WASM/JS engine file
  - Runs in Web Worker for non-blocking execution

### 4. Hooks (`src/hooks/`)
React custom hooks for shared logic.

#### Files:
- **`useStockfish.js`**
  - React hook for Stockfish engine integration
  - Manages engine state (ready, searching, evaluation)
  - Provides `evaluatePosition()` callback
  - Returns: `{ isReady, isSearching, evaluation, error, evaluatePosition }`

### 5. Application Core (`src/`)

#### Files:
- **`main.jsx`**
  - Application entry point
  - Renders React root component
  - Imports global styles

- **`App.jsx`**
  - Main application component
  - Manages global state (moves, currentMoveIndex, opening)
  - Coordinates between components
  - Layout and styling

- **`App.css`**
  - Component-specific styles
  - Layout definitions

- **`index.css`**
  - Global CSS styles
  - CSS resets and defaults
  - Theme colors (dark theme)

### 6. Configuration Files

- **`vite.config.js`**
  - Vite build configuration
  - React plugin setup
  - Base path: `/chessReviewSite/` for GitHub Pages

- **`eslint.config.js`**
  - ESLint rules and configuration
  - React-specific linting rules
  - Code quality standards

- **`package.json`**
  - Project dependencies
  - npm scripts:
    - `dev` - Start development server
    - `build` - Build for production
    - `lint` - Run ESLint
    - `preview` - Preview production build

- **`.gitignore`**
  - Excludes: node_modules/, dist/, .vite/, .env

## Application Flow

### 1. Initialization
```
User opens app → App.jsx loads → 
Stockfish engine initializes via useStockfish hook →
UI renders with empty state
```

### 2. Game Analysis
```
User pastes PGN → PgnInput component →
parsePGN() validates and extracts moves →
detectOpening() identifies opening →
State updates (moves, opening) →
UI updates (chessboard, move list, summary)
```

### 3. Move Navigation
```
User clicks move in list → currentMoveIndex updates →
ChessboardView calculates FEN for that move →
Chessboard displays position →
(Optional) Engine evaluates position →
EvaluationBar updates
```

### 4. Engine Evaluation
```
Position changes → useStockfish.evaluatePosition(fen) →
EngineService sends UCI commands to worker →
Worker returns evaluation (cp/mate + bestMove) →
State updates → EvaluationBar shows result
```

## Data Flow

### State Management
The application uses React's built-in state management (useState):

- **App.jsx** (Root Level):
  - `moves[]` - Array of move objects with FEN positions
  - `currentMoveIndex` - Index of currently displayed move
  - `opening` - Detected opening information

- **Component Level**:
  - PGN input text
  - Tab selection (Moves/Accuracy)
  - Playback state
  - Loading states

### Move Object Structure
```javascript
{
  moveNumber: 1,           // Move number (1, 2, 3...)
  san: "e4",              // Standard Algebraic Notation
  from: "e2",             // Starting square
  to: "e4",               // Destination square
  piece: "p",             // Piece type (k,q,r,b,n,p)
  color: "w",             // Color (w/b)
  fenAfter: "rnbqkbnr..." // FEN after this move
}
```

### Evaluation Object Structure
```javascript
{
  cp: 25,                 // Centipawn score (positive = white advantage)
  mate: null,             // Mate in X moves (or null)
  bestMove: "e2e4"        // Best move in UCI format
}
```

## Key Features

1. **PGN Import** - Parse and validate chess games in PGN format
2. **Opening Detection** - Identify chess openings using ECO database
3. **Move-by-Move Navigation** - Step through games forward/backward
4. **Position Evaluation** - Real-time Stockfish analysis
5. **Visual Feedback** - Evaluation bar showing position assessment
6. **Responsive Design** - Works on desktop and mobile devices
7. **Dark Theme** - Modern dark UI for reduced eye strain

## Development Workflow

### Setup
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev        # Start dev server at http://localhost:5173
```

### Production Build
```bash
npm run build      # Creates optimized build in dist/
npm run preview    # Preview production build locally
```

### Code Quality
```bash
npm run lint       # Run ESLint
```

## Deployment
The application is configured for GitHub Pages deployment:
- Build output: `frontend/dist/`
- Base URL: `/chessReviewSite/`
- Deployed via GitHub Actions (configuration in repository settings)

## Future Enhancements
Based on stub files and incomplete features:
- Move accuracy calculation
- Move classification (brilliant, good, mistake, blunder)
- Detailed move explanations
- Game statistics and insights
- Multiple game comparison
- User preferences and settings
- Export analyzed games

## Browser Compatibility
- Modern browsers with ES6+ support
- Web Worker support required for Stockfish
- WebAssembly support recommended for optimal performance

## Performance Considerations
- Stockfish runs in Web Worker (non-blocking)
- Lazy loading of ECO database
- Efficient FEN calculation using memoization
- Optimized re-renders with React.useMemo

## License
Check repository for license information.

## Contributing
This is an educational/personal project. For contributions, please refer to the repository owner.
