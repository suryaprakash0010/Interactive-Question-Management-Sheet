const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fetch data from external API
router.get('/fetch-sheet', async (req, res) => {
  try {
    const response = await axios.get('https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching external data:', error);
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});

module.exports = router;
