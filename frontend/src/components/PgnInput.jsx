import { useState } from "react";
import { parsePGN } from "../analysis/pgnParser";

export default function PgnInput({ onMovesParsed }) {
  const [pgn, setPgn] = useState("");

  const handleAnalyze = () => {
    const result = parsePGN(pgn);

    if (result.error) {
      alert(result.error);
      return;
    }

    console.log("Parsed moves:", result.moves);

    // SEND parsed moves to App.jsx
    onMovesParsed(result.moves);
  };

  return (
    <div>
      <h3 style={{ color: "#ffffff" }}>Paste PGN</h3>

      <textarea
        style={{ 
          width: "100%", 
          height: "120px",
          backgroundColor: "#242424",
          color: "#ffffff",
          border: "1px solid #666",
          borderRadius: "4px",
          padding: "8px"
        }}
        placeholder="Paste PGN here"
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
      />

      <button 
        onClick={handleAnalyze} 
        style={{ 
          marginTop: "10px",
          backgroundColor: "#242424",
          color: "#ffffff",
          border: "1px solid #666"
        }}
      >
        Analyze Game
      </button>
    </div>
  );
}
