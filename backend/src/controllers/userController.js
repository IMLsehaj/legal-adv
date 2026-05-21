const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register a new lawyer (by admin)
// @route   POST /api/users/lawyer
// @access  Private/Admin
const createLawyer = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password, // The model's pre-save hook will hash this
        role: 'lawyer',
    });

    if (user) {
        res.status(201).json({ _id: user.id, name: user.name, email: user.email, role: user.role });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  // req.user is attached by the 'protect' middleware
  res.status(200).json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Lawyer-specific profile update
    if (user.role === 'lawyer') {
        const { specialization, experience, hourlyRate, bio, location } = req.body;
        if (!user.lawyerDetails) {
            user.lawyerDetails = {};
        }
        user.lawyerDetails.specialization = specialization ?? user.lawyerDetails.specialization;
        user.lawyerDetails.experience = experience ?? user.lawyerDetails.experience;
        user.lawyerDetails.hourlyRate = hourlyRate ?? user.lawyerDetails.hourlyRate;
        user.lawyerDetails.bio = bio ?? user.lawyerDetails.bio;
        user.lawyerDetails.location = location ?? user.lawyerDetails.location;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
});

// @desc    Get all lawyers
// @route   GET /api/users/lawyers
// @access  Public
const getLawyers = asyncHandler(async (req, res) => {
    const lawyers = await User.find({ role: 'lawyer' }).select('-password');
    res.json(lawyers);
});

module.exports = {
    createLawyer,
    getProfile,
    updateProfile,
    getLawyers,
};