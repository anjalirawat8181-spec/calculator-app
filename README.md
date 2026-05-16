# CalcVerse — Glassmorphic Multi-Calculator

A polished MERN stack calculator web app with a frosted glass UI and four calculator modes:
- Scientific Calculator
- Currency Converter
- BMI Calculator
- Simple Calculator

## Project Structure

- `client/` — React + Vite frontend
- `server/` — Express backend API
- `.gitignore` — excludes node modules, build output, and `.env`
- `README.md` — project overview and setup

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - `server/.env`
   - `client/.env`

3. Run the backend:
   ```bash
   npm run server
   ```

4. Run the frontend:
   ```bash
   npm run client
   ```

## API Endpoints

- `POST /api/history` — save calculation history
- `GET /api/history` — get last 20 records
- `DELETE /api/history` — clear history
- `GET /api/currency?from=USD&to=INR&amount=100` — convert currency using ExchangeRate-API

## Notes

- Use MongoDB Atlas for `MONGO_URI`
- Use ExchangeRate-API for `EXCHANGE_API_KEY`
- Frontend uses `VITE_API_BASE_URL` to call the backend
