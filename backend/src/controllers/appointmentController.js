const asyncHandler = require('express-async-handler');
const { Appointment, User } = require('../models');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Client or Admin)
const createAppointment = asyncHandler(async (req, res) => {
  const { lawyerId, date, notes } = req.body;

  const lawyer = await User.findById(lawyerId);
  if (!lawyer || lawyer.role !== 'lawyer') {
    res.status(404);
    throw new Error('Lawyer not found or invalid role');
  }

  const appointment = await Appointment.create({
    client: req.user.id,
    lawyer: lawyerId,
    date,
    notes,
  });

  res.status(201).json(appointment);
});

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  let query = {};
  
  // Admins see all, lawyers see their own, clients see their own
  if (req.user.role === 'client') {
    query.client = req.user.id;
  } else if (req.user.role === 'lawyer') {
    query.lawyer = req.user.id;
  }

  const appointments = await Appointment.find(query)
    .populate('client', 'name email')
    .populate('lawyer', 'name email')
    .sort({ date: 1 });

  res.json(appointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Lawyer or Admin)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Ensure lawyers can only update their own appointments
  if (req.user.role === 'lawyer' && appointment.lawyer.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this appointment');
  }

  appointment.status = status || appointment.status;
  const updatedAppointment = await appointment.save();

  res.json(updatedAppointment);
});

module.exports = { createAppointment, getAppointments, updateAppointmentStatus };