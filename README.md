# Chess Review Site

A web-based chess game analyzer powered by Stockfish engine. Analyze your chess games, explore openings, and learn from your moves with real-time position evaluation.

![Chess Review Site](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- 📝 **PGN Import** - Paste your chess games in PGN format
- 🔍 **Opening Detection** - Automatically identifies chess openings using ECO database
- 🤖 **Stockfish Analysis** - Real-time position evaluation using Stockfish engine
- 🎮 **Interactive Board** - Navigate through games move by move
- 📊 **Evaluation Bar** - Visual representation of position advantage
- 🌙 **Dark Theme** - Modern, eye-friendly dark interface
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/btomar00001/chessReviewSite.git
cd chessReviewSite
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
chessReviewSite/
├── frontend/
│   ├── src/
│   │   ├── analysis/        # Game analysis logic
│   │   ├── components/      # React UI components
│   │   ├── engine/          # Stockfish engine integration
│   │   ├── hooks/           # Custom React hooks
│   │   └── ...
│   ├── public/              # Static assets
│   └── package.json
└── PROJECT_STRUCTURE.md     # Detailed documentation
```

For detailed project structure and architecture, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## 📖 Usage

### Analyzing a Game

1. **Get your PGN**: Copy the PGN notation of your chess game from chess.com, lichess.org, or any chess platform.

2. **Paste PGN**: Paste your game into the text area in the Analysis Panel.

3. **Analyze**: Click the "Analyze" button to load your game.

4. **Navigate**: Use the move list or navigation controls to step through your game.

5. **Review**: The evaluation bar and opening information will help you understand your position.

### Example PGN
```
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Chess Logic**: chess.js 1.4.0
- **Chess UI**: react-chessboard 5.8.4
- **Chess Engine**: Stockfish.js (Web Worker)
- **Code Quality**: ESLint 9.39.1

## 🏗️ Build for Production

```bash
npm run build
```

The optimized production build will be created in the `frontend/dist/` directory.

## 🌐 Deployment

This project is configured for GitHub Pages deployment:

1. Build the project:
```bash
cd frontend
npm run build
```

2. Deploy to GitHub Pages (automated via GitHub Actions or manual):
```bash
# The build is configured with base path /chessReviewSite/
```

## 📚 Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Comprehensive project documentation
- [Frontend README](./frontend/README.md) - Frontend-specific information

## 🎓 How It Works

### Game Analysis Flow
1. User pastes PGN notation
2. Parser validates and extracts moves using chess.js
3. Opening detector matches moves against ECO database
4. Each move is stored with its resulting FEN position
5. User can navigate through moves
6. Stockfish evaluates positions in real-time
7. Evaluation bar visualizes the analysis

### Engine Integration
- Stockfish runs in a Web Worker for non-blocking execution
- UCI protocol communication for engine commands
- Configurable search depth (default: 15)
- Real-time evaluation updates

## 🔮 Future Enhancements

- [ ] Move accuracy calculation
- [ ] Move classification (brilliant, good, inaccuracy, mistake, blunder)
- [ ] Detailed move explanations and suggestions
- [ ] Game statistics and insights
- [ ] Multiple game comparison
- [ ] User accounts and saved games
- [ ] Opening repertoire builder
- [ ] Tactical puzzles from games

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Stockfish](https://stockfishchess.org/) - The powerful chess engine
- [chess.js](https://github.com/jhlywa/chess.js) - Chess move validation library
- [react-chessboard](https://github.com/Clariity/react-chessboard) - Beautiful chessboard component
- ECO Database contributors

## 📧 Contact

Project Owner: [@btomar00001](https://github.com/btomar00001)

Project Link: [https://github.com/btomar00001/chessReviewSite](https://github.com/btomar00001/chessReviewSite)

---

Made with ♟️ and ❤️
