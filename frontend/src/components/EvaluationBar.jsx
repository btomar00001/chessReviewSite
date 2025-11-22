import React from 'react';

export default function EvaluationBar({ evaluation }) {
    // Calculate height percentage based on evaluation
    // Cap at +5/-5 for visual purposes
    let whiteHeight = 50;
    let scoreText = "0.0";

    if (evaluation) {
        if (evaluation.mate) {
            // Mate in X
            if (evaluation.mate > 0) {
                whiteHeight = 100;
                scoreText = `M${evaluation.mate}`;
            } else {
                whiteHeight = 0;
                scoreText = `M${Math.abs(evaluation.mate)}`;
            }
        } else if (evaluation.cp !== null) {
            // Centipawns
            const cp = evaluation.cp;
            scoreText = (cp / 100).toFixed(1);

            // Sigmoid-like clamping for visual bar
            // +500 cp -> ~95%, -500 cp -> ~5%
            const clamped = Math.max(-500, Math.min(500, cp));
            whiteHeight = 50 + (clamped / 10);
        }
    }

    return (
        <div style={{
            width: '30px',
            height: '100%', // Fill parent height
            backgroundColor: '#404040',
            display: 'flex',
            flexDirection: 'column-reverse', // Build from bottom up
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* White Bar */}
            <div style={{
                width: '100%',
                height: `${whiteHeight}%`,
                backgroundColor: '#ffffff',
                transition: 'height 0.5s ease'
            }} />

            {/* Score Label */}
            <div style={{
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                color: whiteHeight > 50 ? '#000' : '#fff',
                bottom: whiteHeight > 50 ? 'unset' : '5px',
                top: whiteHeight > 50 ? '5px' : 'unset',
                zIndex: 10
            }}>
                {scoreText}
            </div>
        </div>
    );
}
