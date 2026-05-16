import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const createParser = (value) => {
  const tokens = value
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/%/g, '/100')
    .replace(/[^0-9+\-*/.() ]+/g, '');
  let index = 0;

  const peek = () => tokens[index] || '\0';
  const consume = () => tokens[index++] || '\0';
  const parseNumber = () => {
    let number = '';
    while (/[0-9.]/.test(peek())) {
      number += consume();
    }
    return parseFloat(number);
  };

  const parseFactor = () => {
    if (peek() === '+') { consume(); return parseFactor(); }
    if (peek() === '-') { consume(); return -parseFactor(); }
    if (peek() === '(') {
      consume();
      const value = parseExpression();
      if (peek() === ')') consume();
      return value;
    }
    return parseNumber();
  };

  const parseTerm = () => {
    let value = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const next = parseFactor();
      if (op === '*') value *= next;
      if (op === '/') value /= next;
    }
    return value;
  };

  const parseExpression = () => {
    let value = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const next = parseTerm();
      if (op === '+') value += next;
      if (op === '-') value -= next;
    }
    return value;
  };

  return parseExpression();
};

export default function SimpleCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const navigate = useNavigate();

  const appendValue = (value) => {
    setExpression((prev) => (prev === '0' ? value : prev + value));
  };

  const handlePress = async (value) => {
    if (value === 'AC') {
      setExpression('');
      setResult('0');
      return;
    }

    if (value === '+/-') {
      setExpression((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
      return;
    }

    if (value === '%') {
      try {
        const converted = createParser(expression + '%');
        setResult(String(converted));
        setExpression(String(converted));
      } catch {
        setResult('Error');
      }
      return;
    }

    if (value === '=') {
      try {
        const answer = createParser(expression);
        const display = Number.isFinite(answer) ? String(parseFloat(answer.toFixed(8))) : 'Error';
        setResult(display);
        setExpression(display);
        await axios.post(`${API_BASE}/api/history`, {
          type: 'simple',
          input: expression,
          result: display
        });
      } catch (error) {
        setResult('Error');
        setExpression('');
      }
      return;
    }

    if (['÷', '×', '−', '+'].includes(value)) {
      if (!expression || /[+\-×÷]$/.test(expression)) {
        return;
      }
    }

    appendValue(value);
  };

  const buttons = [
    ['AC', '+/-', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <main>
      <section className="glass-card glass-panel" style={{ maxWidth: 380, width: '100%' }}>
        <div className="page-header">
          <button className="glass-button small-button" onClick={() => navigate(-1)}>
            ← Home
          </button>
          <div>
            <h1 className="section-title">Simple Calculator</h1>
          </div>
        </div>

        <div className="calculator-screen">
          <div className="display-expression">{expression || '0'}</div>
          <div className="display-value">{result}</div>
        </div>

        <div className="grid-buttons" style={{ marginTop: 20 }}>
          {buttons.flat().map((button, index) => {
            const isWide = button === '0';
            const isOperator = ['÷', '×', '−', '+', '='].includes(button);
            const styleClass = button === 'AC' || button === '+/-' || button === '%' ? 'action-button' : isOperator ? 'operator-button' : '';
            return (
              <button
                key={`${button}-${index}`}
                className={`glass-button ${styleClass} ${isWide ? 'wide' : ''}`}
                onClick={() => handlePress(button)}
              >
                {button}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
