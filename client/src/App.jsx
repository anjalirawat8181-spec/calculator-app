import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SimpleCalculator from './pages/SimpleCalculator';
import ScientificCalculator from './pages/ScientificCalculator';
import CurrencyCalculator from './pages/CurrencyCalculator';
import BMICalculator from './pages/BMICalculator';
import History from './pages/History';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/simple" element={<SimpleCalculator />} />
        <Route path="/scientific" element={<ScientificCalculator />} />
        <Route path="/currency" element={<CurrencyCalculator />} />
        <Route path="/bmi" element={<BMICalculator />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
