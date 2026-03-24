import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// THE DISCIPLINED TRADER — iPhone Scroll Fix Version
// ═══════════════════════════════════════════════════════════════════════════════

const SHEET_ID = "1alZvoybv7WSTF9LEMTKnJ1g3TFvjMAiYkLFpRf5V-zY";

const STORAGE_KEYS = {
  PRE_MARKET: 'disciplined_trader_premarket',
  POST_MARKET: 'disciplined_trader_postmarket'
};

const loadData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  :root {
    --ocean-1: #E3F6FC;
    --ocean-2: #C5EDF8;
    --ocean-3: #9EE2F5;
    --ocean-4: #75D4EF;
    --ocean-5: #4AC5E8;
    --ocean-deep: #2AA8D0;
    --white: #FFFFFF;
    --white-90: rgba(255, 255, 255, 0.9);
    --white-80: rgba(255, 255, 255, 0.8);
    --white-60: rgba(255, 255, 255, 0.6);
    --text-dark: #1E3A45;
    --text-mid: #4A7080;
    --text-light: #8AABB8;
    --text-muted: #B5CED8;
    --green: #4ECBA0;
    --green-soft: rgba(78, 203, 160, 0.15);
    --yellow: #F5B74E;
    --yellow-soft: rgba(245, 183, 78, 0.15);
    --red: #EF7B6C;
    --red-soft: rgba(239, 123, 108, 0.15);
    --shadow-soft: 0 8px 40px rgba(42, 168, 208, 0.12);
    --shadow-medium: 0 12px 50px rgba(42, 168, 208, 0.18);
    --shadow-glow: 0 0 60px rgba(74, 197, 232, 0.25);
  }

  /* --- THE NUCLEAR SCROLL FIX --- */
  html {
    height: 100%;
    overflow: hidden; /* Prevent the HTML tag from double-scrolling */
  }

  body {
    font-family: 'Quicksand', 'Noto Sans TC', -apple-system, sans-serif;
    background: linear-gradient(165deg, var(--ocean-1), var(--ocean-5));
    height: 100%;
    width: 100%;
    overflow-y: auto !important; /* This is now the ONLY scrollable layer */
    -webkit-overflow-scrolling: touch; 
    position: relative;
  }

  #root {
    min-height: 100%;
    display: block;
  }

  /* Backgrounds MUST be fixed so they don't move with the scroll */
  .water-bg, .light-rays {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
  }

  .water-bg::before, .water-bg::after {
    content: '';
    position: absolute;
    border-radius: 45%;
    background: rgba(255, 255, 255, 0.06);
    animation: ripple 20s linear infinite;
  }
  .water-bg::before { width: 200%; height: 200%; top: -50%; left: -50%; animation-duration: 25s; }
  .water-bg::after { width: 180%; height: 180%; top: -40%; left: -40%; animation-duration: 30s; animation-direction: reverse; }

  @keyframes ripple {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .app {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 160px; /* Space for the floating bottom nav */
  }

  .page {
    flex: 1;
    max-width: 420px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
  }

  /* ... all other styles (cards, buttons, etc.) remain identical ... */
  .header { text-align: center; padding: 16px 0 24px; }
  .header-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-light); margin-bottom: 8px; }
  .header-title { font-size: 26px; font-weight: 700; color: var(--text-dark); letter-spacing: -0.5px; margin-bottom: 6px; }
  .header-date { font-size: 14px; color: var(--text-light); font-weight: 500; }
  .card { background: var(--white-90); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; padding: 22px; margin-bottom: 14px; box-shadow: var(--shadow-soft); border: 1px solid var(--white-80); }
  .card-title { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-light); margin-bottom: 16px; }
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); margin-bottom: 10px; }
  .form-input, .form-select, .form-textarea { width: 100%; padding: 14px 16px; font-size: 15px; font-family: inherit; font-weight: 500; color: var(--text-dark); background: var(--white); border: 2px solid transparent; border-radius: 14px; outline: none; transition: all 0.25s ease; box-shadow: 0 2px 12px rgba(42, 168, 208, 0.06); }
  .form-textarea { resize: none; min-height: 90px; line-height: 1.6; }
  .form-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238AABB8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 18px; padding-right: 42px; }
  .toggle-group { display: flex; align-items: center; gap: 14px; padding: 12px 0; }
  .toggle { position: relative; width: 52px; height: 30px; background: var(--text-muted); border-radius: 15px; cursor: pointer; transition: all 0.3s ease; }
  .toggle.active { background: linear-gradient(135deg, var(--ocean-5), var(--green)); }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; background: var(--white); border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.3s; }
  .toggle.active::after { transform: translateX(22px); }
  .toggle-label { font-size: 14px; font-weight: 500; color: var(--text-dark); }
  .readiness { text-align: center; padding: 12px 0; }
  .readiness-value { font-size: 44px; font-weight: 700; margin-bottom: 6px; }
  .readiness-label { font-size: 13px; color: var(--text-light); }
  .readiness-bar { height: 8px; background: rgba(42, 168, 208, 0.12); border-radius: 4px; margin: 14px 0 8px; overflow: hidden; }
  .readiness-fill { height: 100%; border-radius: 4px; transition: width 0.6s; }
  .btn-primary { width: 100%; padding: 16px 28px; font-size: 15px; font-weight: 700; color: var(--white); background: linear-gradient(135deg, var(--ocean-5), var(--green)); border: none; border-radius: 18px; cursor: pointer; box-shadow: 0 6px 24px rgba(74, 197, 232, 0.35); transition: all 0.3s; margin-top: 8px; }
  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; display: flex; justify-content: center; padding: 10px 16px 24px; pointer-events: none; }
  .bottom-nav-inner { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(24px); border-radius: 28px; padding: 8px 12px; display: flex; align-items: center; gap: 4px; box-shadow: 0 8px 40px rgba(42, 168, 208, 0.25); pointer-events: auto; max-width: 300px; width: 100%; }
  .nav-item { display: flex; flex-direction: column; align-items: center; padding: 10px; border-radius: 20px; border: none; background: transparent; cursor: pointer; min-width: 68px; }
  .nav-item.active { background: linear-gradient(135deg, var(--ocean-4), var(--ocean-5)); color: white; }
  .nav-label { font-size: 10px; font-weight: 600; margin-top: 2px; }
  .nav-icon { font-size: 20px; }
  .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: var(--white); padding: 14px 24px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); z-index: 2000; transition: transform 0.4s; }
  .toast.show { transform: translateX(-50%) translateY(0); }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIC (Keeping your original Claude logic intact)
// ═══════════════════════════════════════════════════════════════════════════════

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const formatShortDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const calculateReadiness = (trend, breadth, traction, cognitive) => {
  const trendScore = { 'Uptrend': 2, 'Sideways': 1, 'Downtrend': 0 }[trend] || 0;
  const breadthScore = { 'Good': 2, 'Neutral': 1, 'Poor': 0 }[breadth] || 0;
  const cogScore = { 'Clear': 2, 'Neutral': 1, 'Overwhelmed': 0 }[cognitive] || 0;
  return Math.round(((trendScore + breadthScore + traction + cogScore) / 9) * 100);
};

const getReadinessColor = (pct) => pct >= 70 ? 'var(--green)' : pct >= 45 ? 'var(--yellow)' : 'var(--red)';
const getReadinessStatus = (pct) => pct >= 70 ? 'Good to go' : pct >= 45 ? 'Proceed with caution' : 'Consider sitting out';

const PreMarketPage = ({ onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [masterFilter, setMasterFilter] = useState(false);
  const [indexTrend, setIndexTrend] = useState('Uptrend');
  const [marketBreadth, setMarketBreadth] = useState('Good');
  const [traction, setTraction] = useState(2);
  const [cognitiveLoad, setCognitiveLoad] = useState('Clear');
  const [planAction, setPlanAction] = useState('Buying');
  const [planTickers, setPlanTickers] = useState('');
  const [planNotes, setPlanNotes] = useState('');

  const readiness = calculateReadiness(indexTrend, marketBreadth, traction, cognitiveLoad);

  const handleSave = () => {
    const data = loadData(STORAGE_KEYS.PRE_MARKET);
    const newEntry = { date: selectedDate, timestamp: new Date().toISOString(), masterFilter: true, indexTrend, marketBreadth, traction, cognitiveLoad, readinessScore: readiness, planAction, planTickers, planNotes };
    const existingIndex = data.findIndex(d => d.date === selectedDate);
    if (existingIndex >= 0) data[existingIndex] = newEntry; else data.push(newEntry);
    saveData(STORAGE_KEYS.PRE_MARKET, data);
    onSave('success', `Plan locked for ${formatShortDate(selectedDate)}`);
  };

  return (
    <div className="page">
      <div className="header">
        <div className="header-eyebrow">morning ritual</div>
        <h1 className="header-title">Pre-market Plan</h1>
        <div className="header-date">{formatDate(selectedDate)}</div>
      </div>

      <div className="card">
        <div className="card-title">Master Filter</div>
        <div className="toggle-group" onClick={() => setMasterFilter(!masterFilter)}>
          <div className={`toggle ${masterFilter ? 'active' : ''}`} />
          <span className="toggle-label">I choose a Profit Factor > 3 over a single $10k win today.</span>
        </div>
      </div>

      {masterFilter && (
        <>
          <div className="card">
            <div className="card-title">Market Conditions</div>
            <div className="form-group">
              <label className="form-label">Index Trend</label>
              <select className="form-select" value={indexTrend} onChange={e => setIndexTrend(e.target.value)}>
                <option>Uptrend</option><option>Sideways</option><option>Downtrend</option>
              </select>
            </div>
            <div className="readiness">
              <div className="readiness-bar"><div className="readiness-fill" style={{ width: `${readiness}%`, background: getReadinessColor(readiness) }} /></div>
              <div className="readiness-value" style={{ color: getReadinessColor(readiness) }}>{readiness}%</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Battle Plan</div>
            <div className="form-group">
              <label className="form-label">Watchlist</label>
              <input className="form-input" placeholder="e.g. NVDA, TSLA" value={planTickers} onChange={e => setPlanTickers(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" placeholder="Strategies..." value={planNotes} onChange={e => setPlanNotes(e.target.value)} />
            </div>
          </div>
          <button className="btn-primary" onClick={handleSave}>🔒 Lock in today's plan</button>
        </>
      )}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('premarket');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="water-bg" />
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
      <div className="app">
        {currentPage === 'premarket' && <PreMarketPage onSave={showToast} />}
        {/* Placeholder for other pages to keep code light */}
        {currentPage !== 'premarket' && <div className="page"><h1 className="header-title">Coming Soon</h1></div>}
        
        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            <button className={`nav-item ${currentPage === 'premarket' ? 'active' : ''}`} onClick={() => setCurrentPage('premarket')}>
              <span className="nav-icon">🌅</span><span className="nav-label">Plan</span>
            </button>
            <button className={`nav-item ${currentPage === 'audit' ? 'active' : ''}`} onClick={() => setCurrentPage('audit')}>
              <span className="nav-icon">🧘</span><span className="nav-label">Audit</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
