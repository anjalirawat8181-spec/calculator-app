const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { from, to, amount } = req.query;
  const apiKey = process.env.EXCHANGE_API_KEY;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    const requestUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(requestUrl);
    const data = response.data;

    if (data.result !== 'success') {
      return res.status(502).json({ error: 'Currency API error', details: data });
    }

    res.json({
      from: data.base_code,
      to: data.target_code,
      amount: Number(amount),
      rate: data.conversion_rate,
      convertedAmount: data.conversion_result
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch currency data', details: error.message });
  }
});

module.exports = router;
