import React, { useState, useEffect } from 'react';
import { parsePGN } from "../analysis/pgnParser";
import { useStockfish } from "../hooks/useStockfish";

export default function AnalysisPanel({
    moves,
    currentMoveIndex,
    onMoveSelect,
    onMovesParsed,
    opening,
    readOnlyMode = false
}) {
    const [pgn, setPgn] = useState("");
    const [activeTab, setActiveTab] = useState('Moves'); // Moves or Accuracy
    const [isPlaying, setIsPlaying] = useState(false);
    const { evaluatePosition, isReady, isSearching, evaluation, error } = useStockfish();

    // Playback Effect
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                onMoveSelect((prevIndex) => {
                    if (prevIndex < moves.length - 1) {
                        return prevIndex + 1;
                    } else {
                        setIsPlaying(false); // Stop at end
                        return prevIndex;
                    }
                });
            }, 1000); // 1 second interval
        }
        return () => clearInterval(interval);
    }, [isPlaying, moves.length, onMoveSelect]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleAnalyze = async () => {
        const result = parsePGN(pgn);
        if (result.error) {
            alert(result.error);
            return;
        }

        // Switch to moves tab on successful parse
        setActiveTab('Moves');
        onMovesParsed(result.moves);

        // Engine test on first move (optional)
        if (result.moves.length > 0 && result.moves[0].fenAfter) {
            try {
                await evaluatePosition(result.moves[0].fenAfter);
            } catch (e) { console.error(e); }
        }
    };

    // Navigation Handlers
    const goToBeginning = () => onMoveSelect(-1);
    const goBack = () => onMoveSelect(Math.max(-1, currentMoveIndex - 1));
    const goForward = () => onMoveSelect(Math.min(moves.length - 1, currentMoveIndex + 1));
    const goToEnd = () => onMoveSelect(moves.length - 1);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#1e1e1e',
            borderLeft: '1px solid #333'
        }}>
            {/* Panel Header */}
            <div style={{
                backgroundColor: '#4a90e2',
                color: '#fff',
                padding: '15px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>
                Game Analysis
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                <button
                    onClick={() => setActiveTab('Moves')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: activeTab === 'Moves' ? '#2a2a2a' : 'transparent',
                        color: activeTab === 'Moves' ? '#fff' : '#aaa',
                        border: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'Moves' ? '2px solid #4a90e2' : 'none'
                    }}
                >
                    Moves
                </button>
                <button
                    onClick={() => setActiveTab('Accuracy')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: activeTab === 'Accuracy' ? '#2a2a2a' : 'transparent',
                        color: activeTab === 'Accuracy' ? '#fff' : '#aaa',
                        border: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'Accuracy' ? '2px solid #4a90e2' : 'none'
                    }}
                >
                    Accuracy
                </button>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>

                {activeTab === 'Moves' ? (
                    <>
                        {/* Engine Lines (Mocked) */}
                        <div style={{ marginBottom: '20px', backgroundColor: '#252525', padding: '10px', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold', color: '#aaa' }}>Best Lines</span>
                                <span style={{ color: '#4a90e2', fontWeight: 'bold' }}>+0.19</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '5px' }}>
                                1. <span style={{ color: '#fff' }}>e4 e5</span> 2. Nf3 Nc6 3. Bb5 a6
                            </div>
                            <div style={{ fontSize: '12px', color: '#888' }}>
                                Depth: 22 • Stockfish 16
                            </div>
                        </div>

                        {/* Opening Info */}
                        {opening && (
                            <div style={{
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#2a2a2a',
                                borderLeft: '3px solid #4a90e2',
                                borderRadius: '4px'
                            }}>
                                <div style={{ color: '#fff', fontWeight: 'bold' }}>{opening.eco} - {opening.name}</div>
                                <div style={{ color: '#aaa', fontSize: '12px' }}>{opening.variation}</div>
                            </div>
                        )}

                        {/* Move List */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
                            {moves.length === 0 && <div style={{ color: '#aaa', padding: '10px' }}>No moves yet.</div>}

                            {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
                                const white = moves[i * 2];
                                const black = moves[i * 2 + 1];
                                return (
                                    <div key={i} style={{ display: 'flex', width: '100%', borderBottom: '1px solid #333' }}>
                                        <div style={{ width: '40px', padding: '5px', color: '#666', backgroundColor: '#222' }}>{white.moveNumber}.</div>
                                        <div
                                            onClick={() => onMoveSelect(white.index)}
                                            style={{
                                                flex: 1,
                                                cursor: 'pointer',
                                                backgroundColor: currentMoveIndex === white.index ? '#3a3a3a' : 'transparent',
                                                color: currentMoveIndex === white.index ? '#fff' : '#ccc',
                                                padding: '5px 10px',
                                            }}
                                        >
                                            {white.san}
                                        </div>
                                        <div
                                            onClick={() => black && onMoveSelect(black.index)}
                                            style={{
                                                flex: 1,
                                                cursor: 'pointer',
                                                backgroundColor: black && currentMoveIndex === black.index ? '#3a3a3a' : 'transparent',
                                                color: black ? (currentMoveIndex === black.index ? '#fff' : '#ccc') : 'transparent',
                                                padding: '5px 10px',
                                            }}
                                        >
                                            {black ? black.san : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    /* Accuracy Tab (Mocked) */
                    /* Accuracy Tab (Mocked) */
                    <div>
                        {/* Dual Accuracy Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            backgroundColor: '#2a2a2a',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#eee', color: '#000' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>95.7%</div>
                                <div style={{ fontSize: '12px', color: '#555' }}>White</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: '#111', color: '#fff' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>94.6%</div>
                                <div style={{ fontSize: '12px', color: '#aaa' }}>Black</div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '16px', color: '#eee', marginBottom: '10px' }}>Accuracies</div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #444', color: '#aaa' }}>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                                    <th style={{ textAlign: 'center', padding: '8px' }}>White</th>
                                    <th style={{ textAlign: 'center', padding: '8px' }}>Black</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px', color: '#26c2a3' }}>✨ Brilliant</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>0</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>0</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#5c8bb0' }}>! Critical</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>0</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>3</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#4caf50' }}>✅ Best</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>42</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>42</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#8bc34a' }}>👍 Excellent</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>15</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>4</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#aeb188' }}>✓ Okay</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>2</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>6</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#ff9800' }}>❓ Inaccuracy</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>0</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>1</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#e6912c' }}>? Mistake</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>0</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>0</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#f44336' }}>🔴 Blunder</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>0</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>2</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px', color: '#9c27b0' }}>📚 Theory</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>3</td>
                                    <td style={{ textAlign: 'center', color: '#fff' }}>3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bottom Navigation Controls */}
            <div style={{
                padding: '15px',
                backgroundColor: '#1e1e1e',
                borderTop: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <button onClick={goToBeginning} style={{ background: 'none', fontSize: '24px', color: '#aaa', cursor: 'pointer' }}>⏮</button>
                <button onClick={goBack} style={{ background: 'none', fontSize: '24px', color: '#fff', cursor: 'pointer' }}>⬅</button>
                <button onClick={togglePlay} style={{ background: 'none', fontSize: '24px', color: '#fff', cursor: 'pointer' }}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button onClick={goForward} style={{ background: 'none', fontSize: '24px', color: '#fff', cursor: 'pointer' }}>➡</button>
                <button onClick={goToEnd} style={{ background: 'none', fontSize: '24px', color: '#aaa', cursor: 'pointer' }}>⏭</button>
            </div>
        </div>
    );
}
