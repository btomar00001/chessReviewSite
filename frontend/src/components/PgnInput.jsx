import { useState, useEffect } from "react";
import { parsePGN } from "../analysis/pgnParser";
import { useStockfish } from "../hooks/useStockfish";

export default function PgnInput({ onMovesParsed }) {
  const [pgn, setPgn] = useState("");
  const { evaluatePosition, isReady, isSearching, evaluation, error } = useStockfish();

  const handleAnalyze = async () => {
    const result = parsePGN(pgn);

    if (result.error) {
      alert(result.error);
      return;
    }

    console.log("Parsed moves:", result.moves);

    // ⭐ TEMP ENGINE TEST
    if (result.moves && result.moves.length > 0) {
      const firstMove = result.moves[0];
      if (firstMove && firstMove.fenAfter) {
        console.log("Testing engine with FEN:", firstMove.fenAfter);

        try {
          const res = await evaluatePosition(firstMove.fenAfter);
          console.log("Engine test result:", res);
          // Alert will be handled by the effect below or just show in console
        } catch (err) {
          console.error("Engine test failed:", err);
        }
      }
    }

    // SEND parsed moves to App.jsx
    onMovesParsed(result.moves);
  };

  // Show feedback when evaluation changes
  useEffect(() => {
    if (evaluation) {
      console.log("Current Evaluation:", evaluation);
      // Optional: Show a toast or alert for the test
      // alert(`Engine Analysis: Best Move: ${evaluation.bestMove}, Score: ${evaluation.cp}`);
    }
  }, [evaluation]);

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
          padding: "8px",
        }}
        placeholder="Paste PGN here"
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
      />

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleAnalyze}
          disabled={!isReady || isSearching}
          style={{
            backgroundColor: isReady ? "#242424" : "#444",
            color: "#ffffff",
            border: "1px solid #666",
            cursor: isReady ? "pointer" : "wait",
            padding: "8px 16px"
          }}
        >
          {isSearching ? "Analyzing..." : "Analyze Game"}
        </button>

        {!isReady && <span style={{ color: "#aaa", fontSize: "12px" }}>Loading Engine...</span>}
        {error && <span style={{ color: "red", fontSize: "12px" }}>Engine Error</span>}
      </div>

      {evaluation && (
        <div style={{ marginTop: "10px", color: "#aaa", fontSize: "12px" }}>
          Last Eval: {evaluation.cp !== null ? `CP: ${evaluation.cp}` : `Mate: ${evaluation.mate}`} | Best: {evaluation.bestMove}
        </div>
      )}
    </div>
  );
}
