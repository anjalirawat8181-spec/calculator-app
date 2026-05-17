import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function format(v) {
  return Number.isFinite(v) ? v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [annualRate, setAnnualRate] = useState('7.5');
  const [tenure, setTenure] = useState('60');
  const navigate = useNavigate();

  const { emi, totalPayment, totalInterest, principalPortionPct, interestPortionPct } = useMemo(() => {
    const P = Number(principal) || 0;
    const r = (Number(annualRate) || 0) / 12 / 100;
    const n = Number(tenure) || 0;
    let EMI = 0;
    if (n <= 0) {
      EMI = 0;
    } else if (r === 0) {
      EMI = P / n;
    } else {
      const x = Math.pow(1 + r, n);
      EMI = (P * r * x) / (x - 1);
    }
    const total = EMI * n;
    const interest = total - P;
    const principalPct = total > 0 ? (P / total) * 100 : 0;
    const interestPct = total > 0 ? (interest / total) * 100 : 0;
    return { emi: EMI, totalPayment: total, totalInterest: interest, principalPortionPct: principalPct, interestPortionPct: interestPct };
  }, [principal, annualRate, tenure]);

  const size = 160;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const principalDash = (principalPortionPct / 100) * circumference;
  const interestDash = circumference - principalDash;

  return (
    <main>
      <section className="glass-card glass-panel" style={{ maxWidth: 540, width: '100%' }}>
        <div className="page-header">
          <button className="glass-button small-button" onClick={() => navigate(-1)}>← Home</button>
          <div>
            <h1 className="section-title">EMI Calculator</h1>
            <p className="subtitle">Calculate monthly EMI, total payment and interest</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr 220px' }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <label>
              <div className="badge" style={{ marginBottom: 8 }}>Loan Amount</div>
              <input type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </label>

            <label>
              <div className="badge" style={{ marginBottom: 8 }}>Annual Interest Rate (%)</div>
              <input type="number" step="0.01" min="0" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
            </label>

            <label>
              <div className="badge" style={{ marginBottom: 8 }}>Loan Tenure (months)</div>
              <input type="number" min="0" value={tenure} onChange={(e) => setTenure(e.target.value)} />
            </label>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="subtitle">Monthly EMI</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>₹ {format(emi)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="subtitle">Total Payment</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>₹ {format(totalPayment)}</div>
                <div className="subtitle" style={{ marginTop: 6 }}>Total Interest</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444' }}>₹ {format(totalInterest)}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}> 
              <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
                <circle r={radius} fill="transparent" stroke="#e6e6e6" strokeWidth={stroke} />
                <circle r={radius} fill="transparent" stroke="#60a5fa" strokeWidth={stroke} strokeLinecap="round"
                  strokeDasharray={`${principalDash} ${interestDash}`} />
                <circle r={radius} fill="transparent" stroke="rgba(239,68,68,0.9)" strokeWidth={stroke} strokeLinecap="round"
                  strokeDasharray={`${interestDash} ${principalDash}`} strokeDashoffset={-principalDash} />
              </g>
            </svg>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>{format(principalPortionPct)}% <span className="subtitle">Principal</span></div>
              <div style={{ fontWeight: 700, color: '#ef4444' }}>{format(interestPortionPct)}% <span className="subtitle">Interest</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
