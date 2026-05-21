const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');

// @desc    Get user documents
// @route   GET /api/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
  // Sort by newest first
  const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(documents);
});

// @desc    Add a document
// @route   POST /api/documents
// @access  Private
const addDocument = asyncHandler(async (req, res) => {
  const { name, status, score, date, type } = req.body;
  const doc = await Document.create({
    user: req.user._id,
    name, 
    status, 
    score, 
    date, 
    type
  });
  res.status(201).json(doc);
});

module.exports = { getDocuments, addDocument };