import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return '₹0.00';
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return '0.00';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
  const [annualReturn, setAnnualReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('10');
  const navigate = useNavigate();

  const { investedAmount, estimatedReturns, totalValue, yearlyData, maxValue } = useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const annual = Number(annualReturn) || 0;
    const years = Math.max(1, Number(timePeriod) || 1);
    const i = annual / 12 / 100;
    const n = years * 12;

    const totalValueCalc = n <= 0 || P <= 0
      ? 0
      : i === 0
        ? P * n
        : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);

    const investedAmountCalc = P * n;
    const estimatedReturnsCalc = totalValueCalc - investedAmountCalc;

    const yearlyDataCalc = Array.from({ length: years }, (_, index) => {
      const year = index + 1;
      const months = year * 12;
      const yearValue = i === 0
        ? P * months
        : P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      const yearInvested = P * months;
      return {
        year,
        invested: yearInvested,
        returns: yearValue - yearInvested,
        total: yearValue
      };
    });

    const maxValueCalc = Math.max(...yearlyDataCalc.map((item) => item.total), investedAmountCalc, 1);

    return {
      investedAmount: investedAmountCalc,
      estimatedReturns: estimatedReturnsCalc,
      totalValue: totalValueCalc,
      yearlyData: yearlyDataCalc,
      maxValue: maxValueCalc
    };
  }, [monthlyInvestment, annualReturn, timePeriod]);

  return (
    <main>
      <section className="glass-card glass-panel" style={{ maxWidth: 840, width: '100%' }}>
        <div className="page-header">
          <button className="glass-button small-button" onClick={() => navigate(-1)}>
            ← Home
          </button>
          <div>
            <h1 className="section-title">SIP Calculator</h1>
            <p className="subtitle">Monthly investment, expected return and horizon for SIP growth</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 22 }}>
          <div className="sip-grid">
            <label>
              <div className="badge" style={{ marginBottom: 8 }}>Monthly Investment (₹)</div>
              <input
                type="number"
                min="0"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(e.target.value)}
              />
            </label>
            <label>
              <div className="badge" style={{ marginBottom: 8 }}>Expected Annual Return (%)</div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
              />
            </label>
            <label>
              <div className="badge" style={{ marginBottom: 8 }}>Time Period (years)</div>
              <input
                type="number"
                min="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              />
            </label>
          </div>

          <div className="sip-summary-grid">
            <div className="sip-summary-card">
              <p className="subtitle">Invested Amount</p>
              <strong>{formatCurrency(investedAmount)}</strong>
            </div>
            <div className="sip-summary-card">
              <p className="subtitle">Estimated Returns</p>
              <strong>{formatCurrency(estimatedReturns)}</strong>
            </div>
            <div className="sip-summary-card">
              <p className="subtitle">Total Value</p>
              <strong>{formatCurrency(totalValue)}</strong>
            </div>
          </div>

          <div className="glass-card glass-panel" style={{ padding: '20px 20px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
              <div>
                <h2 className="section-title" style={{ fontSize: '1.35rem' }}>Year-by-year growth</h2>
                <p className="subtitle" style={{ margin: 0 }}>A stacked bar shows invested capital and returns each year.</p>
              </div>
              <div className="badge" style={{ background: 'rgba(96,165,250,0.16)', border: '1px solid rgba(96,165,250,0.25)', color: '#dbeafe' }}>
                {timePeriod} years · {annualReturn}% p.a.
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {yearlyData.map((entry) => {
                const investedWidth = (entry.invested / maxValue) * 100;
                const returnsWidth = (entry.returns / maxValue) * 100;

                return (
                  <div key={entry.year} className="sip-bar-row">
                    <div className="sip-bar-label">Year {entry.year}</div>
                    <div className="sip-bar-track">
                      <div
                        className="sip-bar-fill sip-bar-invested"
                        style={{ width: `${investedWidth}%` }}
                      />
                      <div
                        className="sip-bar-fill sip-bar-returns"
                        style={{ width: `${returnsWidth}%` }}
                      />
                    </div>
                    <div className="sip-bar-value">{formatCurrency(entry.total)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
