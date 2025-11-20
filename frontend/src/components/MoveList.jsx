export default function MoveList({ moves = [], currentMoveIndex, onMoveSelect }) {
  if (!moves || moves.length === 0) {
    return (
      <div>
        <h3 style={{ color: "#ffffff" }}>Moves</h3>
        <p style={{ color: "#ffffff" }}>No moves yet.</p>
      </div>
    );
  }

  // Group moves by move number (white and black pairs)
  const moveGroups = [];
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];
    moveGroups.push({ 
      moveNumber: whiteMove.moveNumber, 
      white: whiteMove, 
      black: blackMove 
    });
  }

  return (
    <div>
      <h3 style={{ color: "#ffffff" }}>Moves ({moves.length} total)</h3>
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        {moveGroups.map((group) => (
          <div 
            key={group.moveNumber} 
            style={{ 
              padding: "5px",
              marginBottom: "4px",
              backgroundColor: "#242424",
              cursor: "pointer"
            }}
          >
            <span 
              style={{ 
                marginRight: "10px",
                color: "#ffffff"
              }}
              onClick={() => onMoveSelect && onMoveSelect(group.white.index)}
            >
              {group.moveNumber}. {group.white.san}
            </span>
            {group.black && (
              <span 
                style={{ color: "#ffffff" }}
                onClick={() => onMoveSelect && onMoveSelect(group.black.index)}
              >
                {group.black.san}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
