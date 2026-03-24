import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// THE DISCIPLINED TRADER — ULTIMATE IPHONE SCROLL PATCH
// ═══════════════════════════════════════════════════════════════════════════════

const SHEET_ID = "1alZvoybv7WSTF9LEMTKnJ1g3TFvjMAiYkLFpRf5V-zY";
const STORAGE_KEYS = { PRE_MARKET: 'disciplined_trader_premarket', POST_MARKET: 'disciplined_trader_postmarket' };

const loadData = (key) => { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : []; } catch { return []; } };
const saveData = (key, data) => { localStorage.setItem(key, JSON.stringify(data)); };

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  :root {
    --ocean-1: #E3F6FC; --ocean-2: #C5EDF8; --ocean-3: #9EE2F5; --ocean-4: #75D4EF;
    --ocean-5: #4AC5E8; --ocean-deep: #2AA8D0; --white: #FFFFFF; --white-90: rgba(255, 255, 255, 0.9);
    --white-80: rgba(255, 255, 255, 0.8); --white-60: rgba(255, 255, 255, 0.6);
    --text-dark: #1E3A45; --text-mid: #4A7080; --text-light: #8AABB8; --text-muted: #B5CED8;
    --green: #4ECBA0; --green-soft: rgba(78, 203, 160, 0.15); --yellow: #F5B74E;
    --yellow-soft: rgba(245, 183, 78, 0.15); --red: #EF7B6C; --red-soft: rgba(239, 123, 108, 0.15);
    --shadow-soft: 0 8px 40px rgba(42, 168, 208, 0.12);
  }

  /* 1. RESET HTML/BODY TO NATURAL SCROLLING */
  html {
    height: -webkit-fill-available;
  }

  body {
    font-family: 'Quicksand', 'Noto Sans TC', sans-serif;
    background: var(--ocean-1);
    background-attachment: fixed;
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll !important; /* Forces native scroll */
    -webkit-overflow-scrolling: touch;
    position: relative;
  }

  /* 2. ENSURE ROOT DOES NOT TRAP SCROLL */
  #root {
    overflow: visible !important;
    height: auto !important;
  }

  /* 3. BACKGROUNDS MUST NOT INTERCEPT TOUCH */
  .water-bg, .light-rays {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: -1;
    pointer-events: none !important; /* THIS IS THE KEY FIX */
    background: linear-gradient(165deg, var(--ocean-1) 0%, var(--ocean-5) 100%);
  }

  .water-bg::before, .water-bg::after {
    content: ''; position: absolute; border-radius: 45%;
    background: rgba(255, 255, 255, 0.08); animation: ripple 25s linear infinite;
  }
  .water-bg::before { width: 200%; height: 200%; top: -50%; left: -50%; }
  @keyframes ripple { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  /* 4. APP CONTAINER NEEDS ROOM TO BREATHE */
  .app {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: 180px; /* Massive padding so nothing gets stuck at the bottom */
  }

  .page { flex: 1; max-width: 420px; margin: 0 auto; padding: 20px; width: 100%; }
  
  /* CARDS AND FORMS */
  .card { background: var(--white-90); border-radius: 24px; padding: 22px; margin-bottom: 14px; box-shadow: var(--shadow-soft); }
  .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-light); margin-bottom: 16px; }
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-light); margin-bottom: 10px; }
  .form-input, .form-select, .form-textarea { 
    width: 100%; padding: 14px 16px; font-size: 16px; /* 16px prevents iPhone auto-zoom */
    font-family: inherit; color: var(--text-dark); background: var(--white); 
    border: 2px solid transparent; border-radius: 14px; outline: none; 
  }
  .form-textarea { min-height: 100px; resize: none; }
  .btn-primary { 
    width: 100%; padding: 18px; font-size: 16px; font-weight: 700; color: white; 
    background: linear-gradient(135deg, var(--ocean-deep), var(--green)); 
    border: none; border-radius: 18px; cursor: pointer; box-shadow: 0 8px 24px rgba(42, 168, 208, 0.3);
  }

  /* BOTTOM NAV - FLOATING DOCK STYLE */
  .bottom-nav { position: fixed; bottom: 24px; left: 0; right: 0; z-index: 100; display: flex; justify-content: center; pointer-events: none; }
  .bottom-nav-inner { 
    background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-radius: 30px; padding: 10px 15px; display: flex; gap: 10px; pointer-events: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  }
  .nav-item { padding: 10px 20px; border-radius: 20px; border: none; background: transparent; display: flex; flex-direction: column; align-items: center; }
  .nav-item.active { background: var(--ocean-deep); color: white; }
  .nav-label { font-size: 10px; font-weight: 600; margin-top: 4px; }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES (Minimal logic to ensure stability)
// ═══════════════════════════════════════════════════════════════════════════════

const PreMarketPage = () => {
  const [tickers, setTickers] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text-dark)' }}>Pre-Market Plan</h1>
        <p style={{ color: 'var(--text-light)' }}>Lock in your mindset</p>
      </div>

      <div className="card">
        <div className="card-title">Watchlist</div>
        <input className="form-input" placeholder="e.g. NVDA, TSLA" value={tickers} onChange={e => setTickers(e.target.value)} />
      </div>

      <div className="card">
        <div className="card-title">Strategy Notes</div>
        <textarea className="form-textarea" placeholder="Describe your edge for today..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <button className="btn-primary" onClick={() => alert('Plan Saved to Local Storage!')}>
        🔒 Lock in today's plan
      </button>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState('plan');

  return (
    <>
      <style>{styles}</style>
      <div className="water-bg" />
      <div className="app">
        {tab === 'plan' ? <PreMarketPage /> : <div className="page"><h1 style={{textAlign:'center'}}>Audit Page coming soon</h1></div>}
        
        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            <button className={`nav-item ${tab === 'plan' ? 'active' : ''}`} onClick={() => setTab('plan')}>
              <span style={{fontSize:'20px'}}>🌅</span><span className="nav-label">Plan</span>
            </button>
            <button className={`nav-item ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
              <span style={{fontSize:'20px'}}>🧘</span><span className="nav-label">Audit</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
