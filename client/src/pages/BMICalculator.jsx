import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const categories = [
  { label: 'Underweight', color: '#60a5fa', range: [0, 18.5] },
  { label: 'Normal', color: '#22c55e', range: [18.5, 25] },
  { label: 'Overweight', color: '#f59e0b', range: [25, 30] },
  { label: 'Obese', color: '#ef4444', range: [30, 100] }
];

function getCategory(value) {
  const found = categories.find((item) => value >= item.range[0] && value < item.range[1]);
  return found || categories[categories.length - 1];
}

export default function BMICalculator() {
  const [mode, setMode] = useState('metric');
  const [kg, setKg] = useState('70');
  const [cm, setCm] = useState('170');
  const [lbs, setLbs] = useState('154');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  const [bmi, setBmi] = useState(null);
  const [displayValue, setDisplayValue] = useState(0);
  const navigate = useNavigate();

  const bmiResult = useMemo(() => {
    if (bmi == null) return null;
    return getCategory(bmi);
  }, [bmi]);

  useEffect(() => {
    if (bmi == null) {
      setDisplayValue(0);
      return;
    }
    let start = 0;
    const end = bmi;
    const duration = 500;
    const startTime = performance.now();
    const frame = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplayValue(parseFloat((start + (end - start) * progress).toFixed(1)));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [bmi]);

  const calculateBmi = async () => {
    let value = 0;
    if (mode === 'metric') {
      const heightMeters = Number(cm) / 100;
      value = Number(kg) / (heightMeters * heightMeters || 1);
    } else {
      const totalInches = Number(feet) * 12 + Number(inches);
      value = (703 * Number(lbs)) / (totalInches * totalInches || 1);
    }
    const rounded = Number(value.toFixed(1));
    setBmi(rounded);
    await axios.post(`${API_BASE}/api/history`, {
      type: 'bmi',
      input: mode === 'metric'
        ? `${kg} kg, ${cm} cm`
        : `${lbs} lbs, ${feet} ft ${inches} in`,
      result: `${rounded} (${getCategory(rounded).label})`
    });
  };

  const marker = bmi ? Math.min(100, Math.max(0, ((bmi - 10) / 40) * 100)) : 0;

  return (
    <main>
      <section className="glass-card glass-panel" style={{ maxWidth: 420, width: '100%' }}>
        <div className="page-header">
          <button className="glass-button small-button" onClick={() => navigate(-1)}>
            ← Home
          </button>
          <div>
            <h1 className="section-title">BMI Calculator</h1>
            <p className="subtitle">SI units or customary units body mass index</p>
          </div>
        </div>

        <div className="toggle-pill" style={{ marginBottom: 24 }}>
          <button className={mode === 'metric' ? 'active' : ''} onClick={() => setMode('metric')}>SI units</button>
          <button className={mode === 'imperial' ? 'active' : ''} onClick={() => setMode('imperial')}>customary units</button>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {mode === 'metric' ? (
            <>
              <label>
                <div className="badge" style={{ marginBottom: 8 }}>Weight (kg)</div>
                <input type="number" min="0" value={kg} onChange={(e) => setKg(e.target.value)} />
              </label>
              <label>
                <div className="badge" style={{ marginBottom: 8 }}>Height (cm)</div>
                <input type="number" min="0" value={cm} onChange={(e) => setCm(e.target.value)} />
              </label>
            </>
          ) : (
            <>
              <label>
                <div className="badge" style={{ marginBottom: 8 }}>Weight (lbs)</div>
                <input type="number" min="0" value={lbs} onChange={(e) => setLbs(e.target.value)} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <label>
                  <div className="badge" style={{ marginBottom: 8 }}>Height (ft)</div>
                  <input type="number" min="0" value={feet} onChange={(e) => setFeet(e.target.value)} />
                </label>
                <label>
                  <div className="badge" style={{ marginBottom: 8 }}>Height (in)</div>
                  <input type="number" min="0" value={inches} onChange={(e) => setInches(e.target.value)} />
                </label>
              </div>
            </>
          )}

          <button className="glass-button primary-button" onClick={calculateBmi}>
            Calculate BMI
          </button>

          {bmi !== null && (
            <div className="glass-card" style={{ padding: '24px 24px' }}>
              <div className="display-value" style={{ fontSize: '3rem' }}>{displayValue}</div>
              <div className="bmi-badge" style={{ background: bmiResult?.color || '#94a3b8' }}>{bmiResult?.label}</div>
              <div className="bmi-scale" style={{ marginTop: 24 }}>
                <div className="bmi-marker" style={{ left: `${marker}%` }} />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
