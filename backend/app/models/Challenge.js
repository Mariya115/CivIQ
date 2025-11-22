const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 1
  },
  durationDays: {
    type: Number,
    default: 30
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['Reporting', 'Community', 'Environment', 'Safety', 'General'],
    default: 'General'
  },
  requirements: [{
    type: String
  }],
  participants: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);