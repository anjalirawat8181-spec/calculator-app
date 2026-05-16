import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function parseScientific(expression) {
  const source = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt');

  const tokens = [];
  const regex = /([0-9]*\.?[0-9]+|pi|e|sin|cos|tan|log|sqrt|[+\-*/^()%])/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    tokens.push(match[0]);
  }
  let index = 0;

  const peek = () => tokens[index] || null;
  const consume = () => tokens[index++] || null;

  const parsePrimary = () => {
    const token = peek();
    if (!token) return 0;
    if (token === '+') {
      consume();
      return parsePrimary();
    }
    if (token === '-') {
      consume();
      return -parsePrimary();
    }
    if (token === '(') {
      consume();
      const value = parseExpression();
      if (peek() === ')') consume();
      return value;
    }
    if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(token)) {
      consume();
      const arg = parsePrimary();
      switch (token) {
        case 'sin':
          return Math.sin(arg);
        case 'cos':
          return Math.cos(arg);
        case 'tan':
          return Math.tan(arg);
        case 'log':
          return Math.log10(arg);
        case 'sqrt':
          return Math.sqrt(arg);
        default:
          return arg;
      }
    }
    if (token === 'pi') {
      consume();
      return Math.PI;
    }
    if (token === 'e') {
      consume();
      return Math.E;
    }
    const number = parseFloat(token);
    if (!Number.isNaN(number)) {
      consume();
      return number;
    }
    throw new Error('Invalid token');
  };

  const parseExponent = () => {
    let value = parsePrimary();
    while (peek() === '^') {
      consume();
      value = Math.pow(value, parseExponent());
    }
    return value;
  };

  const parseTerm = () => {
    let value = parseExponent();
    while (peek() === '*' || peek() === '/' ) {
      const op = consume();
      const next = parseExponent();
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
}

export default function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const navigate = useNavigate();

  const append = (value) => setExpression((prev) => prev + value);

  const handlePress = async (value) => {
    if (value === 'AC') {
      setExpression('');
      setResult('0');
      return;
    }
    if (value === 'DEL') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }
    if (value === '=') {
      try {
        const answer = parseScientific(expression);
        const display = Number.isFinite(answer) ? String(parseFloat(answer.toFixed(10))) : 'Error';
        setResult(display);
        setExpression(display);
        await axios.post(`${API_BASE}/api/history`, {
          type: 'scientific',
          input: expression,
          result: display
        });
      } catch (error) {
        setResult('Error');
      }
      return;
    }
    if (value === 'x²') {
      append('^2');
      return;
    }
    if (value === 'x³') {
      append('^3');
      return;
    }
    if (value === 'π') {
      append('π');
      return;
    }
    if (value === 'e') {
      append('e');
      return;
    }
    if (value === '√') {
      append('√(');
      return;
    }
    if (value === '^') {
      append('^');
      return;
    }
    if (value === '+/-') {
      setExpression((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
      return;
    }
    append(value);
  };

  const rows = [
    ['sin', 'cos', 'tan', 'log'],
    ['√', 'x²', 'x³', 'π'],
    ['(', ')', 'e', '^'],
    ['DEL', 'AC', '+/-', '%']
  ];

  const padButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '−'],
    ['0', '.', '=','+']
  ];

  return (
    <main>
      <section className="glass-card glass-panel" style={{ maxWidth: 480, width: '100%' }}>
        <div className="page-header">
          <button className="glass-button small-button" onClick={() => navigate(-1)}>
            ← Home
          </button>
          <div>
            <h1 className="section-title">Scientific Calculator</h1>
            <p className="subtitle">Advanced math, trig, powers and roots</p>
          </div>
        </div>

        <div className="calculator-screen">
          <div className="display-expression">{expression || '0'}</div>
          <div className="display-value">{result}</div>
        </div>

        <div className="grid-buttons" style={{ marginTop: 20 }}>
          {rows.flat().map((button) => {
            const isFunction = ['sin', 'cos', 'tan', 'log', '√', 'x²', 'x³', 'π', 'e', '^', '(', ')'].includes(button);
            return (
              <button
                key={button}
                className={`glass-button ${isFunction ? 'action-button' : 'operator-button'}`}
                onClick={() => handlePress(button)}
              >
                {button}
              </button>
            );
          })}
        </div>

        <div className="grid-buttons" style={{ marginTop: 16 }}>
          {padButtons.flat().map((button) => (
            <button
              key={button}
              className={`glass-button ${button === '=' ? 'accent-button' : ['÷','×','−','+'].includes(button) ? 'operator-button' : ''} ${button === '0' ? 'wide' : ''}`}
              onClick={() => handlePress(button)}
            >
              {button}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
