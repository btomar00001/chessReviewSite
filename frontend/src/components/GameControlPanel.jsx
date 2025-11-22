import React, { useState, useRef } from 'react';

export default function GameControlPanel({ onPgnSubmit, onReset }) {
    const [pgnInput, setPgnInput] = useState("");
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setPgnInput(content);
                onPgnSubmit(content);
            };
            reader.readAsText(file);
        }
    };

    const handleAnalyze = () => {
        if (pgnInput.trim()) {
            onPgnSubmit(pgnInput);
        }
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1e1e1e',
            borderRight: '1px solid #333',
            padding: '15px',
            color: '#fff'
        }}>
            {/* Game Setup Section */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px', color: '#eee' }}>Game Setup</h3>

                <input
                    type="file"
                    accept=".pgn"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#333',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '15px'
                    }}>
                    ☁️ Upload PGN File
                </button>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Paste PGN</label>
                    <textarea
                        value={pgnInput}
                        onChange={(e) => setPgnInput(e.target.value)}
                        placeholder="Paste PGN..."
                        style={{
                            width: '100%',
                            height: '80px',
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: '#fff',
                            padding: '8px',
                            resize: 'vertical',
                            fontFamily: 'monospace',
                            fontSize: '12px'
                        }}
                    />
                </div>

                <button
                    onClick={handleAnalyze}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#4a90e2',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Analyze Game
                </button>
            </div>

            {/* Recent Games Section */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <h3 style={{ fontSize: '16px', color: '#eee' }}>Recent Games</h3>
                <div style={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '10px', borderBottom: '1px solid #333', cursor: 'pointer', backgroundColor: '#333' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Carlsen vs. Gukesh</div>
                        <div style={{ fontSize: '11px', color: '#aaa' }}>2024 • 1-0</div>
                    </div>
                    <div style={{ padding: '10px', borderBottom: '1px solid #333', cursor: 'pointer' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Kasparov vs. Deep Blue</div>
                        <div style={{ fontSize: '11px', color: '#aaa' }}>1997 • 0-1</div>
                    </div>
                    <div style={{ padding: '10px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Fischer vs. Spassky</div>
                        <div style={{ fontSize: '11px', color: '#aaa' }}>1972 • 1/2-1/2</div>
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={onReset}
                    title="Reset Board"
                    style={{ flex: 1, padding: '8px', backgroundColor: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}
                >
                    ↺
                </button>
                <button
                    title="Flip Board"
                    style={{ flex: 1, padding: '8px', backgroundColor: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}
                >
                    ⇄
                </button>
                <button
                    title="Settings"
                    style={{ flex: 1, padding: '8px', backgroundColor: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}
                >
                    ⚙️
                </button>
            </div>
        </div>
    );
}
