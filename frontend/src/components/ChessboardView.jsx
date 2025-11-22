import { useMemo } from "react";
import { Chessboard } from "react-chessboard";
import EvaluationBar from "./EvaluationBar";

export default function ChessboardView({ moves = [], currentMoveIndex, onMoveSelect, evaluation }) {
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
      width: '100%',
      aspectRatio: '1 / 1',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
    }
  }), [fen]);

  // Create a unique key based on FEN to force remount when position changes
  const boardKey = useMemo(() => {
    return `board-${fen.replace(/\s/g, '-').substring(0, 50)}`;
  }, [fen]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      {/* Top Player (Black) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#ccc',
        padding: '0 5px',
        width: '100%',
        maxWidth: 'calc(100vh - 180px + 25px)' // Match board width + eval bar gap
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', backgroundColor: '#444', borderRadius: '4px' }}></div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>Carlsen, Magnus</div>
            <div style={{ fontSize: '12px' }}>2837</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
          <span>♚</span>
          <span>00:00</span>
        </div>
      </div>

      {/* Board Area with Eval Bar */}
      <div style={{
        display: 'flex',
        gap: '5px',
        height: 'calc(100vh - 180px)', // Constrain height to viewport minus headers/footers
        maxHeight: '800px',
        width: '100%',
        justifyContent: 'center'
      }}>
        <div style={{ width: '20px', flexShrink: 0, height: '100%' }}>
          <EvaluationBar evaluation={evaluation} />
        </div>

        <div style={{
          height: '100%',
          aspectRatio: '1/1',
          maxWidth: 'calc(100vh - 180px)' // Ensure width doesn't exceed height constraint
        }}>
          <div key={boardKey} style={{ width: "100%", height: "100%" }}>
            <Chessboard key={boardKey} options={chessboardOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Player (White) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#ccc',
        padding: '0 5px',
        width: '100%',
        maxWidth: 'calc(100vh - 180px + 25px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', backgroundColor: '#444', borderRadius: '4px' }}></div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#fff' }}>Gukesh D</div>
            <div style={{ fontSize: '12px' }}>2787</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' }}>
          <span>♔</span>
          <span>00:00</span>
        </div>
      </div>

      {moves && moves.length > 0 && (
        <div style={{ marginTop: "5px", fontSize: "12px", color: "#666", textAlign: "center" }}>
          {currentMoveIndex >= 0
            ? `Move ${currentMoveIndex + 1} of ${moves.length}`
            : `Starting position (${moves.length} moves total)`}
          <br />
          <small style={{ wordBreak: "break-all" }}>FEN: {fen}</small>
        </div>
      )}
    </div>
  );
}
