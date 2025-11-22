const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Infrastructure', 'Waste Management', 'Public Safety', 'Environment', 'Transportation', 'Other']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['reported', 'in_progress', 'resolved', 'rejected'],
    default: 'reported'
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  images: [{
    url: String,
    caption: String
  }],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  resolutionNotes: String,
  resolutionImages: [{
    url: String,
    caption: String
  }],
  aiValidation: {
    score: Number,
    isValid: Boolean,
    feedback: String
  },
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
reportSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);