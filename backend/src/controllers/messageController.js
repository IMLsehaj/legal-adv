const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });
  res.status(201).json(message);
});

// @desc    Get conversation history
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
});

module.exports = { sendMessage, getMessages };