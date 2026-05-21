const express = require('express');
const router = express.Router();
const { analyzeCase, generateTemplate } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route: POST /api/ai/analyze-case
router.post('/analyze-case', protect, analyzeCase);

// Route: POST /api/ai/generate-template
router.post('/generate-template', protect, generateTemplate);

module.exports = router;