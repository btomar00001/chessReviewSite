import ecoDatabase from "./eco.json";

/**
 * Detects the opening from a list of moves.
 * @param {Array} moves - Array of move objects from pgnParser
 * @returns {Object|null} - { eco, name, variation, movesMatched } or null
 */
export function detectOpening(moves) {
    if (!moves || moves.length === 0) return null;

    // 1. Construct SAN string from moves
    // Format: "1. e4 e5 2. Nf3 Nc6"
    let sanString = "";
    for (let i = 0; i < moves.length; i += 2) {
        const moveNum = moves[i].moveNumber;
        const whiteSan = moves[i].san;
        const blackSan = moves[i + 1] ? moves[i + 1].san : "";

        sanString += `${moveNum}. ${whiteSan}`;
        if (blackSan) {
            sanString += ` ${blackSan}`;
        }
        sanString += " ";
    }
    sanString = sanString.trim();

    // 2. Find longest matching opening
    let bestMatch = null;
    let maxMatchedLength = 0;

    for (const opening of ecoDatabase) {
        // Normalize spaces for comparison
        const openingMoves = opening.moves.replace(/\s+/g, " ").trim();

        // Check if the game starts with this opening
        if (sanString.startsWith(openingMoves)) {
            // We want the longest match (most specific variation)
            if (openingMoves.length > maxMatchedLength) {
                maxMatchedLength = openingMoves.length;
                bestMatch = {
                    ...opening,
                    movesMatched: openingMoves
                };
            }
        }
    }

    return bestMatch;
}
