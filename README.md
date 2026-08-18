# Chess Review Site

A web-based chess game review application built with React and Vite.  
It allows users to paste PGN games, replay moves on an interactive board, detect openings, and run engine-assisted evaluation.

## Features

- PGN import and parsing
- Move-by-move replay with board synchronization
- Opening detection (ECO-based)
- Engine evaluation using Stockfish in the browser
- Dark-themed analysis layout with control, board, and analysis panels

## Tech Stack

- **Frontend:** React 19 + Vite
- **Chess Logic:** `chess.js`
- **Board UI:** `react-chessboard`
- **Engine:** Stockfish (Web Worker + WebAssembly build)

## Stockfish WASM Integration

This project uses a browser-ready Stockfish build (`frontend/src/engine/stockfish.js`) compiled with Emscripten/WebAssembly support.

- Engine commands are managed through `frontend/src/engine/EngineService.js`
- The engine runs in a dedicated Web Worker to keep the UI responsive
- React components access engine state through `frontend/src/hooks/useStockfish.js`

## Project Structure

```text
chessReviewSite/
└── frontend/
    ├── public/
    ├── src/
    │   ├── analysis/        # PGN parsing, opening detection, move classification helpers
    │   ├── components/      # UI panels, chessboard view, controls
    │   ├── engine/          # Stockfish worker wrapper + bundled stockfish build
    │   ├── hooks/           # React hooks (Stockfish lifecycle/evaluation)
    │   ├── App.jsx          # Main 3-column application layout
    │   └── main.jsx         # React entry point
    ├── package.json
    └── vite.config.js
```

## Getting Started

From the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Available Scripts

Run from `frontend/`:

- `npm run dev` — start development server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Notes

- This repository currently contains the frontend application in `frontend/`.
- The existing `frontend/README.md` is the default Vite template and can be kept for frontend-specific scaffold references.
