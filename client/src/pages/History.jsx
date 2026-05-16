import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const typeMap = {
  simple: { label: 'Simple', emoji: '🔢' },
  scientific: { label: 'Scientific', emoji: '🔬' },
  currency: { label: 'Currency', emoji: '💱' },
  bmi: { label: 'BMI', emoji: '🏋️' }
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const options = { hour: 'numeric', minute: 'numeric' };
  return isToday ? `Today at ${new Intl.DateTimeFormat(undefined, options).format(date)}` : `${date.toLocaleDateString()} at ${new Intl.DateTimeFormat(undefined, options).format(date)}`;
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE}/api/history`);
      setHistory(response.data);
    } catch (err) {
      setError('Unable to load history.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${API_BASE}/api/history`);
      setHistory([]);
    } catch {
      setError('Unable to clear history.');
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <main>
      <section className="glass-card glass-panel" style={{ maxWidth: 760, width: '100%' }}>
        <div className="page-header" style={{ alignItems: 'flex-start' }}>
          <button className="glass-button small-button" onClick={() => navigate(-1)}>
            ← Home
          </button>
          <div>
            <h1 className="section-title">📜 Calculation History</h1>
            <p className="subtitle">Your last 20 records are stored here</p>
          </div>
          <button className="glass-button small-button" onClick={clearHistory}>
            Clear History
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            <div style={{ fontSize: '3rem' }}>👻</div>
            <p>No calculations yet. Use one of the calculators to start saving history.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {history.map((item) => {
              const type = typeMap[item.type] || { label: item.type, emoji: '🧮' };
              return (
                <div key={item._id} className="history-row">
                  <div className="icon-badge">{type.emoji}</div>
                  <div className="history-item-meta">
                    <div style={{ fontWeight: 600 }}>{type.label}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{item.input} → {item.result}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{formatTimestamp(item.timestamp)}</div>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="glass-card" style={{ marginTop: 16, padding: '18px 20px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(254,226,226,0.12)', color: '#fee2e2' }}>
            {error}
          </div>
        )}
      </section>
    </main>
  );
}
