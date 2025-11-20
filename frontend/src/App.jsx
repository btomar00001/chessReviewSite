import { useState } from "react";
import PgnInput from "./components/PgnInput";
import ChessboardView from "./components/ChessboardView";
import MoveList from "./components/MoveList";
import SummaryPanel from "./components/SummaryPanel";

function App() {
  const [moves, setMoves] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  const handleMovesParsed = (newMoves) => {
    console.log("App - handleMovesParsed called with", newMoves?.length, "moves");
    // Create a new array reference to ensure React detects the change
    setMoves([...newMoves]);
    // Show final position when moves are parsed
    if (newMoves && newMoves.length > 0) {
      setCurrentMoveIndex(newMoves.length - 1);
    } else {
      setCurrentMoveIndex(-1);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chess Review MVP</h1>

      <PgnInput onMovesParsed={handleMovesParsed} />

      <SummaryPanel moves={moves} />

      <div style={{ display: "flex", marginTop: "20px" }}>
        <div style={{ width: "400px" }}>
          <ChessboardView 
            moves={moves} 
            currentMoveIndex={currentMoveIndex}
            onMoveSelect={setCurrentMoveIndex}
          />
        </div>

        <div style={{ marginLeft: "20px", flex: 1 }}>
          <MoveList 
            moves={moves} 
            currentMoveIndex={currentMoveIndex}
            onMoveSelect={setCurrentMoveIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
