const express = require('express');
const Calculation = require('../models/Calculation');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const history = await Calculation.find()
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch history' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, input, result } = req.body;
    const record = new Calculation({ type, input, result });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to save history' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Calculation.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to clear history' });
  }
});

module.exports = router;
