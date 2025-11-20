import { Chess } from "chess.js";

export function parsePGN(rawPgn) {
  if (!rawPgn || rawPgn.trim().length < 3) {
    return { error: "PGN is empty", moves: [] };
  }

  // Normalize line breaks
  let pgn = rawPgn
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Extract move notation (remove PGN headers if present)
  const lines = pgn.split("\n");
  const moveLines = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Skip header lines (lines that start and end with brackets)
    if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
      continue;
    }
    // Skip empty lines
    if (trimmedLine.length === 0) {
      continue;
    }
    // Collect move notation lines
    moveLines.push(trimmedLine);
  }

  // Join move lines and clean up
  let moveNotation = moveLines.join(" ").trim();
  
  // Remove multiple spaces
  moveNotation = moveNotation.replace(/\s+/g, " ");
  
  // Remove comments (everything between { } or ( ))
  moveNotation = moveNotation.replace(/\{[^}]*\}/g, "");
  moveNotation = moveNotation.replace(/\([^)]*\)/g, "");
  
  // Remove NAGs (numeric annotation glyphs like $1, $2, etc.)
  moveNotation = moveNotation.replace(/\$\d+/g, "");
  
  // Remove move evaluation symbols (!, ?, !!, ??, !?, ?!)
  moveNotation = moveNotation.replace(/[!?]{1,2}/g, "");
  
  // Clean up multiple spaces again
  moveNotation = moveNotation.replace(/\s+/g, " ").trim();

  if (moveNotation.length === 0) {
    return {
      error: "No move notation found in PGN. Please check your PGN format.",
      moves: []
    };
  }

  console.log("Extracted move notation:", moveNotation.substring(0, 100) + (moveNotation.length > 100 ? "..." : ""));

  // Remove game result markers for parsing
  moveNotation = moveNotation.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, "").trim();

  // Parse moves manually - extract move numbers and SAN moves
  // Pattern: "1. e4 e5 2. Nf3 Nc6" or "1.e4 e5 2.Nf3 Nc6"
  // Better pattern that handles both formats
  const movePattern = /(\d+)\.\s*([^\s]+)(?:\s+([^\s]+))?/g;
  const moves = [];
  const game = new Chess();
  let match;
  let moveIndex = 0;
  const allMatches = [];

  // Collect all matches first
  while ((match = movePattern.exec(moveNotation)) !== null) {
    allMatches.push(match);
    console.log("Match found:", match[0], "White:", match[2], "Black:", match[3]);
  }

  console.log("Found", allMatches.length, "move groups");
  console.log("Move notation being parsed:", moveNotation);

  // Process each match
  for (const match of allMatches) {
    const moveNumber = parseInt(match[1], 10);
    const whiteMove = match[2];
    const blackMove = match[3];

    // Apply white move
    if (whiteMove) {
      const fenBefore = game.fen();
      const moveResult = game.move(whiteMove);
      
      if (!moveResult) {
        return {
          error: `Failed to parse move ${moveNumber}. ${whiteMove} - Invalid move notation.`,
          moves: []
        };
      }
      
      const fenAfter = game.fen();
      moves.push({
        index: moveIndex++,
        moveNumber: moveNumber,
        side: "white",
        san: whiteMove,
        fenBefore,
        fenAfter,
      });
    }

    // Apply black move if present
    if (blackMove) {
      const fenBefore = game.fen();
      const moveResult = game.move(blackMove);
      
      if (!moveResult) {
        return {
          error: `Failed to parse move ${moveNumber}...${blackMove} - Invalid move notation.`,
          moves: []
        };
      }
      
      const fenAfter = game.fen();
      moves.push({
        index: moveIndex++,
        moveNumber: moveNumber,
        side: "black",
        san: blackMove,
        fenBefore,
        fenAfter,
      });
    }
  }

  // If no moves were found with the pattern, try alternative parsing
  if (moves.length === 0) {
    console.log("No moves found with pattern matching, trying loadPgn fallback");
    // Try using loadPgn as fallback
    let ok = false;
    const game2 = new Chess();
    
    // Reconstruct PGN with result marker
    let pgnForLoad = moveNotation;
    if (!/(1-0|0-1|1\/2-1\/2|\*)\s*$/.test(pgnForLoad)) {
      pgnForLoad += " *";
    }
    
    try {
      ok = game2.loadPgn(pgnForLoad, { sloppy: true });
    } catch (e) {
      console.log("loadPgn exception:", e);
    }
    
    if (!ok) {
      try {
        game2.reset();
        ok = game2.loadPgn(pgnForLoad);
      } catch (e) {
        console.log("loadPgn exception (no sloppy):", e);
      }
    }
    
    if (ok) {
      // Get move history
      const verboseMoves = game2.history({ verbose: true });
      const moveSans = game2.history();
      
      // Build move list with FEN before/after each move
      game2.reset();
      
      for (let i = 0; i < verboseMoves.length; i++) {
        const move = verboseMoves[i];
        const san = moveSans[i];
        const fenBefore = game2.fen();
        
        const moveResult = game2.move(san);
        if (!moveResult) {
          return {
            error: `Failed to replay move ${i + 1}: ${san}`,
            moves: []
          };
        }
        
        const fenAfter = game2.fen();
        moves.push({
          index: i,
          moveNumber: Math.floor(i / 2) + 1,
          side: move.color === "w" ? "white" : "black",
          san: san,
          fenBefore,
          fenAfter,
        });
      }
    } else {
      return {
        error: `Invalid PGN format — could not parse moves. Please check your PGN syntax.`,
        moves: []
      };
    }
  }

  if (moves.length === 0) {
    return {
      error: `No valid moves found in PGN. Please check your PGN format.`,
      moves: []
    };
  }

  return { error: null, moves };
}
