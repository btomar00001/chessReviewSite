import { useMemo } from "react";
import { Chessboard } from "react-chessboard";

export default function ChessboardView({ moves = [], currentMoveIndex, onMoveSelect }) {
  // Calculate the FEN to display based on moves and currentMoveIndex
  const fen = useMemo(() => {
    if (!moves || moves.length === 0) {
      return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    
    // If currentMoveIndex is -1, show starting position
    if (currentMoveIndex === -1) {
      return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    
    if (currentMoveIndex >= 0 && currentMoveIndex < moves.length) {
      return moves[currentMoveIndex].fenAfter;
    }
    
    // Default to final position
    return moves[moves.length - 1].fenAfter;
  }, [moves.length, currentMoveIndex, moves]);

  // Create options object for react-chessboard v5.8.4 API
  const chessboardOptions = useMemo(() => ({
    position: fen,
    boardOrientation: 'white',
    allowDragging: false,
    allowDrawingArrows: false,
    boardStyle: {
      width: '400px',
      height: '400px'
    }
  }), [fen]);

  // Create a unique key based on FEN to force remount when position changes
  const boardKey = useMemo(() => {
    return `board-${fen.replace(/\s/g, '-').substring(0, 50)}`;
  }, [fen]);

  // Navigation handlers
  const goToBeginning = () => {
    if (onMoveSelect) {
      onMoveSelect(-1); // Starting position
    }
  };

  const goBack = () => {
    if (onMoveSelect) {
      if (currentMoveIndex === -1) {
        // Already at beginning
        return;
      }
      const newIndex = currentMoveIndex - 1;
      onMoveSelect(newIndex >= 0 ? newIndex : -1);
    }
  };

  const goForward = () => {
    if (onMoveSelect && moves.length > 0) {
      if (currentMoveIndex === -1) {
        // Go to first move
        onMoveSelect(0);
      } else if (currentMoveIndex < moves.length - 1) {
        onMoveSelect(currentMoveIndex + 1);
      }
    }
  };

  const goToEnd = () => {
    if (onMoveSelect && moves.length > 0) {
      onMoveSelect(moves.length - 1);
    }
  };

  // Check if buttons should be disabled
  const isAtBeginning = currentMoveIndex === -1;
  const isAtEnd = currentMoveIndex === moves.length - 1;
  const hasMoves = moves && moves.length > 0;

  return (
    <div>
      <h3 style={{ color: "#ffffff" }}>Board</h3>
      <div key={boardKey} style={{ width: "400px", height: "400px" }}>
        <Chessboard key={boardKey} options={chessboardOptions} />
      </div>
      
      {/* Navigation Buttons */}
      {hasMoves && (
        <div style={{ 
          marginTop: "10px", 
          display: "flex", 
          gap: "5px", 
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button 
            onClick={goToBeginning}
            disabled={isAtBeginning}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              cursor: isAtBeginning ? "not-allowed" : "pointer",
              opacity: isAtBeginning ? 0.5 : 1,
              backgroundColor: "#242424",
              color: "#ffffff",
              border: "1px solid #666",
              borderRadius: "4px"
            }}
            title="Go to beginning"
          >
            ⏮ Beginning
          </button>
          <button 
            onClick={goBack}
            disabled={isAtBeginning}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              cursor: isAtBeginning ? "not-allowed" : "pointer",
              opacity: isAtBeginning ? 0.5 : 1,
              backgroundColor: "#242424",
              color: "#ffffff",
              border: "1px solid #666",
              borderRadius: "4px"
            }}
            title="Previous move"
          >
            ⏪ Back
          </button>
          <button 
            onClick={goForward}
            disabled={isAtEnd}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              cursor: isAtEnd ? "not-allowed" : "pointer",
              opacity: isAtEnd ? 0.5 : 1,
              backgroundColor: "#242424",
              color: "#ffffff",
              border: "1px solid #666",
              borderRadius: "4px"
            }}
            title="Next move"
          >
            Forward ⏩
          </button>
          <button 
            onClick={goToEnd}
            disabled={isAtEnd}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              cursor: isAtEnd ? "not-allowed" : "pointer",
              opacity: isAtEnd ? 0.5 : 1,
              backgroundColor: "#242424",
              color: "#ffffff",
              border: "1px solid #666",
              borderRadius: "4px"
            }}
            title="Go to end"
          >
            End ⏭
          </button>
        </div>
      )}

      {moves && moves.length > 0 && (
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#ffffff", textAlign: "center" }}>
          {currentMoveIndex >= 0 
            ? `Move ${currentMoveIndex + 1} of ${moves.length}` 
            : `Starting position (${moves.length} moves total)`}
          <br />
          <small style={{ wordBreak: "break-all", fontSize: "10px", color: "#ffffff" }}>FEN: {fen}</small>
        </div>
      )}
    </div>
  );
}
