const express = require('express');
const router = express.Router();
const { analyzeCase } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route: POST /api/ai/analyze-case
router.post('/analyze-case', protect, analyzeCase);

module.exports = router;