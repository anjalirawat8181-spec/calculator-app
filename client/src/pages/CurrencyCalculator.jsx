import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const currencyOptions = [
  'USD','EUR','GBP','INR','JPY','AUD','CAD','CHF','CNY','SGD','NZD','HKD','SEK','NOK','DKK','MXN','BRL','ZAR','RUB','TRY','KRW','AED','THB','IDR','MYR','PLN','ILS','PHP','CZK','HUF'
];

export default function CurrencyCalculator() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setRate(null);
  };

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.get(`${API_BASE}/api/currency`, {
        params: {
          from: fromCurrency,
          to: toCurrency,
          amount
        }
      });
      const data = response.data;
      setResult(data.convertedAmount);
      setRate(data.rate);
      await axios.post(`${API_BASE}/api/history`, {
        type: 'currency',
        input: `${amount} ${fromCurrency} → ${toCurrency}`,
        result: `${data.convertedAmount} ${toCurrency}`
      });
    } catch (err) {
      setError('Unable to convert currency. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="glass-card glass-panel" style={{ maxWidth: 420, width: '100%' }}>
        <div className="page-header">
          <button className="glass-button small-button" onClick={() => navigate(-1)}>
            ← Home
          </button>
          <div>
            <h1 className="section-title">Currency Converter</h1>
            <p className="subtitle">Live exchange rates for 30 popular currencies</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <label>
              <div className="badge" style={{ marginBottom: 8 }}>From Currency</div>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </label>

            <button type="button" className="glass-button small-button" onClick={swapCurrencies} style={{ justifySelf: 'center' }}>
              ↕ Swap
            </button>

            <label>
              <div className="badge" style={{ marginBottom: 8 }}>To Currency</div>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </label>

            <label>
              <div className="badge" style={{ marginBottom: 8 }}>Amount</div>
              <input
                type="number"
                value={amount}
                min="0"
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <button className="glass-button primary-button" onClick={handleConvert}>
            Convert
          </button>

          {loading && <div className="spinner-ring" />}

          {error && (
            <div className="glass-card" style={{ padding: '18px 20px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(254,226,226,0.12)', color: '#fee2e2' }}>
              {error}
            </div>
          )}

          {result !== null && (
            <div className="glass-card" style={{ padding: '22px 24px' }}>
              <div className="section-title" style={{ fontSize: '2rem', marginBottom: 8 }}>{result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCurrency}</div>
              <div className="rate-chip">1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
