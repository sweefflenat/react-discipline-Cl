import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// THE DISCIPLINED TRADER — FULL VERSION (IPHONE SCROLL FIXED)
// ═══════════════════════════════════════════════════════════════════════════════

const SHEET_ID = "1alZvoybv7WSTF9LEMTKnJ1g3TFvjMAiYkLFpRf5V-zY";
const STORAGE_KEYS = {
  PRE_MARKET: 'disciplined_trader_premarket',
  POST_MARKET: 'disciplined_trader_postmarket'
};

// Utility: Storage
const loadData = (key) => { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : []; } catch { return []; } };
const saveData = (key, data) => { localStorage.setItem(key, JSON.stringify(data)); };

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  :root {
    --ocean-1: #E3F6FC; --ocean-2: #C5EDF8; --ocean-3: #9EE2F5; --ocean-4: #75D4EF;
    --ocean-5: #4AC5E8; --ocean-deep: #2AA8D0; --white: #FFFFFF; --white-90: rgba(255, 255, 255, 0.9);
    --white-80: rgba(255, 255, 255, 0.8); --text-dark: #1E3A45; --text-mid: #4A7080;
    --text-light: #8AABB8; --text-muted: #B5CED8; --green: #4ECBA0; --green-soft: rgba(78, 203, 160, 0.15);
    --yellow: #F5B74E; --yellow-soft: rgba(245, 183, 78, 0.15); --red: #EF7B6C; --red-soft: rgba(239, 123, 108, 0.15);
    --shadow-soft: 0 8px 40px rgba(42, 168, 208, 0.12);
  }

  /* --- IPHONE SCROLL FIX --- */
  html { height: -webkit-fill-available; }
  body {
    font-family: 'Quicksand', 'Noto Sans TC', sans-serif;
    background: var(--ocean-1);
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll !important; /* Force native scroll */
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  #root { overflow: visible !important; height: auto !important; }

  /* Background Fix: pointer-events: none allows thumb touches to pass through */
  .water-bg, .light-rays {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    z-index: -1; pointer-events: none !important;
    background: linear-gradient(165deg, var(--ocean-1) 0%, var(--ocean-5) 100%);
  }

  .water-bg::before, .water-bg::after {
    content: ''; position: absolute; border-radius: 45%;
    background: rgba(255, 255, 255, 0.08); animation: ripple 25s linear infinite;
  }
  .water-bg::before { width: 200%; height: 200%; top: -50%; left: -50%; }
  @keyframes ripple { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  .app { position: relative; z-index: 1; width: 100%; min-height: 100vh; padding-bottom: 180px; }
  .page { flex: 1; max-width: 420px; margin: 0 auto; padding: 20px; width: 100%; animation: fadeInUp 0.4s ease-out; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  /* UI Components */
  .card { background: var(--white-90); backdrop-filter: blur(20px); border-radius: 24px; padding: 22px; margin-bottom: 14px; box-shadow: var(--shadow-soft); border: 1px solid var(--white-80); }
  .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-light); margin-bottom: 16px; letter-spacing: 0.15em; }
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-light); margin-bottom: 10px; }
  
  /* Input Fix: 16px font prevents iOS auto-zoom scroll trap */
  .form-input, .form-select, .form-textarea { 
    width: 100%; padding: 14px 16px; font-size: 16px; 
    font-family: inherit; font-weight: 500; color: var(--text-dark); background: var(--white); 
    border: 2px solid transparent; border-radius: 14px; outline: none; box-shadow: 0 2px 12px rgba(42, 168, 208, 0.06);
  }
  .form-textarea { resize: none; min-height: 90px; }
  
  /* Navigation */
  .bottom-nav { position: fixed; bottom: 24px; left: 0; right: 0; z-index: 1000; display: flex; justify-content: center; pointer-events: none; }
  .bottom-nav-inner { 
    background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(24px); border-radius: 30px; 
    padding: 8px 12px; display: flex; gap: 4px; pointer-events: auto; box-shadow: 0 10px 40px rgba(42, 168, 208, 0.25);
  }
  .nav-item { display: flex; flex-direction: column; align-items: center; padding: 10px 20px; border-radius: 20px; border: none; background: transparent; cursor: pointer; min-width: 68px; }
  .nav-item.active { background: linear-gradient(135deg, var(--ocean-4), var(--ocean-5)); color: white; }
  .nav-label { font-size: 10px; font-weight: 600; margin-top: 3px; }

  /* Readiness & Streaks */
  .readiness-bar { height: 8px; background: rgba(42, 168, 208, 0.12); border-radius: 4px; margin: 14px 0 8px; overflow: hidden; }
  .readiness-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .readiness-value { font-size: 44px; font-weight: 700; text-align: center; }
  .btn-primary { width: 100%; padding: 16px; font-size: 16px; font-weight: 700; color: white; background: linear-gradient(135deg, var(--ocean-deep), var(--green)); border: none; border-radius: 18px; cursor: pointer; box-shadow: 0 6px 24px rgba(74, 197, 232, 0.35); }
`;

// --- LOGIC COMPONENTS ---

const PreMarketPage = () => {
  const [filter, setFilter] = useState(false);
  const [trend, setTrend] = useState('Uptrend');
  const [cog, setCog] = useState('Clear');
  const score = (trend === 'Uptrend' ? 70 : trend === 'Sideways' ? 50 : 30) + (cog === 'Clear' ? 30 : 0);

  return (
    <div className="page">
      <header style={{textAlign:'center', marginBottom: 20}}>
        <h1 style={{fontSize: 26}}>Pre-Market Plan</h1>
      </header>
      <div className="card">
        <div className="card-title">Master Filter</div>
        <div style={{display:'flex', gap: 10, alignItems: 'center'}} onClick={() => setFilter(!filter)}>
           <div style={{width: 20, height: 20, border:'2px solid var(--ocean-deep)', borderRadius: 4, background: filter ? 'var(--ocean-deep)' : 'transparent'}} />
           <span style={{fontSize: 14}}>I choose process over a single win today.</span>
        </div>
      </div>
      {filter && (
        <>
          <div className="card">
            <div className="card-title">Market & Mind</div>
            <div className="form-group">
              <label className="form-label">Trend</label>
              <select className="form-select" value={trend} onChange={e => setTrend(e.target.value)}>
                <option>Uptrend</option><option>Sideways</option><option>Downtrend</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cognitive Load</label>
              <select className="form-select" value={cog} onChange={e => setCog(e.target.value)}>
                <option>Clear</option><option>Neutral</option><option>Overwhelmed</option>
              </select>
            </div>
            <div className="readiness-bar"><div className="readiness-fill" style={{width: `${score}%`, background: score > 60 ? 'var(--green)' : 'var(--yellow)'}} /></div>
            <div className="readiness-value" style={{color: score > 60 ? 'var(--green)' : 'var(--yellow)'}}>{score}%</div>
          </div>
          <div className="card">
            <div className="card-title">Watchlist</div>
            <input className="form-input" placeholder="e.g. NVDA, TSLA" />
          </div>
          <button className="btn-primary" onClick={() => alert('Plan Saved!')}>🔒 Lock in Plan</button>
        </>
      )}
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
        {tab === 'plan' ? <PreMarketPage /> : <div className="page"><h1 style={{textAlign:'center'}}>Audit & Calendar Coming Soon</h1></div>}
        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            <button className={`nav-item ${tab === 'plan' ? 'active' : ''}`} onClick={() => setTab('plan')}>
              <span style={{fontSize: 20}}>🌅</span><span className="nav-label">Plan</span>
            </button>
            <button className={`nav-item ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
              <span style={{fontSize: 20}}>🧘</span><span className="nav-label">Audit</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
