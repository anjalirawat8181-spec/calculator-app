const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['simple', 'scientific', 'currency', 'bmi']
  },
  input: {
    type: String,
    default: ''
  },
  result: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Calculation', calculationSchema);
