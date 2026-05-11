const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    analysis: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
  },
  { timestamps: true }
);

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;