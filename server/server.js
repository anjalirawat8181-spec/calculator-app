const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const historyRoutes = require('./routes/history');
const currencyRoutes = require('./routes/currency');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/history', historyRoutes);
app.use('/api/currency', currencyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CalcVerse API is running.' });
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });
