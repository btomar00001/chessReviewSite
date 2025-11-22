import { useState } from "react";
import Header from "./components/Header";
import ChessboardView from "./components/ChessboardView";
import AnalysisPanel from "./components/AnalysisPanel";
import GameControlPanel from "./components/GameControlPanel";
import { detectOpening } from "./analysis/openingDetector";
import { parsePGN } from "./analysis/pgnParser";
import { useStockfish } from "./hooks/useStockfish";

function App() {
  const [moves, setMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [opening, setOpening] = useState(null);
  const { evaluation } = useStockfish();

  const handlePgnSubmit = (pgn) => {
    const result = parsePGN(pgn);
    if (result.error) {
      alert(result.error);
      return;
    }
    handleMovesParsed(result.moves);
  };

  const handleMovesParsed = (newMoves) => {
    setMoves([...newMoves]);
    const detectedOpening = detectOpening(newMoves);
    setOpening(detectedOpening);
    if (newMoves && newMoves.length > 0) {
      setCurrentMoveIndex(newMoves.length - 1);
    } else {
      setCurrentMoveIndex(-1);
    }
  };

  const handleReset = () => {
    setMoves([]);
    setCurrentMoveIndex(-1);
    setOpening(null);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      backgroundColor: "#121212", // Darker background for Btomar theme
      color: "#fff"
    }}>
      <Header />

      {/* Main 3-Column Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "20% 60% 20%",
        flex: 1,
        overflow: "hidden"
      }}>

        {/* Left Column: Game Controls */}
        <div style={{ overflow: "hidden" }}>
          <GameControlPanel
            onPgnSubmit={handlePgnSubmit}
            onReset={handleReset}
          />
        </div>

        {/* Center Column: Board */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#181818",
          padding: "20px",
          position: "relative",
          overflow: "hidden" // Ensure content doesn't spill out
        }}>
          <ChessboardView
            moves={moves}
            currentMoveIndex={currentMoveIndex}
            onMoveSelect={setCurrentMoveIndex}
            evaluation={evaluation}
          />
        </div>

        {/* Right Column: Analysis & Stats */}
        <div style={{ overflow: "hidden" }}>
          <AnalysisPanel
            moves={moves}
            currentMoveIndex={currentMoveIndex}
            onMoveSelect={setCurrentMoveIndex}
            opening={opening}
            // Pass null for onMovesParsed since input is now on the left
            onMovesParsed={() => { }}
            readOnlyMode={true} // New prop to hide input in right panel
          />
        </div>
      </div>
    </div>
  );
}

export default App;
