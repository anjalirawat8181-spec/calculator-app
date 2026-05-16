import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const cards = [
  { emoji: '🔢', title: 'Simple', description: 'Quick arithmetic & everyday math', route: '/simple' },
  { emoji: '🔬', title: 'Scientific', description: 'Advanced functions, sin, cos, log', route: '/scientific' },
  { emoji: '💱', title: 'Currency', description: 'Live foreign exchange conversions', route: '/currency' },
  { emoji: '🏋️', title: 'BMI', description: 'Body mass index and health bands', route: '/bmi' }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

export default function Home() {
  return (
    <main>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="glass-card glass-card-hover"
        style={{ maxWidth: 1020, width: '100%' }}
      >
        <div className="glass-panel">
          <div className="page-header">
            <div>
              <h1 className="section-title" style={{ background: 'linear-gradient(90deg, #c4b5fd, #60a5fa)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                ✦ CalcVerse
              </h1>
              <p className="subtitle">Choose your calculator</p>
            </div>
            <Link to="/history" className="glass-button small-button">
              📜 History
            </Link>
          </div>

          <div className="card-grid">
            {cards.map((card, index) => (
              <motion.div
                key={card.route}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className="glass-card glass-card-hover"
                style={{ padding: '28px 24px' }}
              >
                <Link to={card.route} style={{ display: 'block', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                    <div className="icon-badge">{card.emoji}</div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.35rem' }}>{card.title} Calculator</h2>
                      <p className="subtitle" style={{ margin: 0 }}>{card.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
