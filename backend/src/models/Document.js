const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  status: { type: String, enum: ['approved', 'corrections', 'pending'], required: true },
  score: { type: Number, default: null },
  date: { type: String, required: true },
  type: { type: String, required: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Document', documentSchema);