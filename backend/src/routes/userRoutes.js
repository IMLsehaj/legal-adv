const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, createLawyer, getLawyers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/lawyer', protect, authorizeRoles('admin'), createLawyer);
router.get('/lawyers', getLawyers); // Public route to get all lawyers

module.exports = router;
