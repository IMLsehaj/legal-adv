const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Both clients and admins can schedule. Everyone can view their own.
router.route('/')
  .get(protect, getAppointments)
  .post(protect, authorizeRoles('client', 'admin'), createAppointment);

// Only lawyers and admins can accept/reject/complete appointments
router.route('/:id/status').put(protect, authorizeRoles('lawyer', 'admin'), updateAppointmentStatus);

module.exports = router;