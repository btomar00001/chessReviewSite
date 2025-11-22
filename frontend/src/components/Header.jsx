import React from 'react';

export default function Header() {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            height: '60px',
            backgroundColor: '#1e1e1e', // Slightly lighter than bg for contrast
            borderBottom: '1px solid #333',
            color: '#fff'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Logo */}
                <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px', color: '#4a90e2' }}>♟️</span>
                    <span>Btomar</span>
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', gap: '20px', marginLeft: '20px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        🔍 Analysis
                    </a>
                    <a href="#" style={{ color: '#aaa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        📁 Archive
                    </a>
                    <a href="#" style={{ color: '#aaa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        📰 News
                    </a>
                </nav>
            </div>

            {/* Right Side Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button style={{
                    backgroundColor: '#4a90e2',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    💙
                </button>
                <button style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    ➜ Sign In
                </button>
                <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#aaa',
                    fontSize: '20px',
                    cursor: 'pointer'
                }}>
                    ⚙️
                </button>
            </div>
        </header>
    );
}
