const express = require('express');
const router = express.Router();
const { getDocuments, addDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDocuments).post(protect, addDocument);

module.exports = router;