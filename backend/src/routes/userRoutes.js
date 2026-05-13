const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, createLawyer } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/lawyer', protect, authorizeRoles('admin'), createLawyer);

module.exports = router;
