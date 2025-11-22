// MongoDB Database Schema for CivIQ
// Collections (Tables) Structure

const mongoose = require('mongoose');

// 1. Users Collection
const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  role: { type: String, enum: ['Citizen', 'Worker', 'Municipal Admin', 'NGO'], default: 'Citizen' },
  points: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 }
}, { timestamps: true, collection: 'users' });

// 2. Reports Collection
const reportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['reported', 'in_progress', 'resolved', 'rejected'], default: 'reported' },
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  images: [{ url: String, caption: String }],
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  pointsAwarded: { type: Number, default: 50 },
  aiValidation: {
    score: Number,
    isValid: Boolean,
    feedback: String
  }
}, { timestamps: true, collection: 'reports' });

// 3. Bills Collection
const billSchema = new mongoose.Schema({
  billId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['electricity', 'water', 'gas', 'internet', 'mobile', 'dtv', 'insurance', 'maintenance'], required: true },
  amount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalAmount: Number,
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  qrCode: String,
  paidAt: Date
}, { timestamps: true, collection: 'bills' });

// 4. Challenges Collection
const challengeSchema = new mongoose.Schema({
  challengeId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  points: { type: Number, required: true },
  durationDays: { type: Number, default: 30 },
  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' },
  category: { type: String, enum: ['Reporting', 'Community', 'Environment', 'Safety', 'General'], default: 'General' },
  requirements: [String],
  participants: { type: Number, default: 0 }
}, { timestamps: true, collection: 'challenges' });

// 5. User Challenges Collection
const userChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completedAt: Date,
  pointsEarned: { type: Number, default: 0 }
}, { timestamps: true, collection: 'user_challenges' });

// 6. Rewards Collection
const rewardSchema = new mongoose.Schema({
  rewardId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  discount: { type: Number, required: true },
  validUntil: { type: Date, required: true },
  used: { type: Boolean, default: false },
  usedAt: Date,
  category: String
}, { timestamps: true, collection: 'rewards' });

// 7. Leaderboard Collection (for caching)
const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rank: { type: Number, required: true },
  points: { type: Number, required: true },
  badge: String,
  period: { type: String, enum: ['weekly', 'monthly', 'yearly', 'alltime'], default: 'alltime' }
}, { timestamps: true, collection: 'leaderboard' });

// 8. Sessions Collection
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  deviceInfo: {
    userAgent: String,
    ip: String,
    location: String
  }
}, { timestamps: true, collection: 'sessions' });

// 9. Notifications Collection
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['report_update', 'reward', 'challenge', 'bill', 'system'], required: true },
  isRead: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true, collection: 'notifications' });

// 10. Analytics Collection
const analyticsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  data: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  category: String,
  value: Number
}, { timestamps: true, collection: 'analytics' });

// 11. Feedback Collection
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  category: { type: String, enum: ['service', 'app', 'resolution', 'general'], default: 'general' },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true, collection: 'feedback' });

// 12. Announcements Collection
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['news', 'alert', 'maintenance', 'event'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  targetAudience: [{ type: String, enum: ['all', 'citizens', 'workers', 'admins'] }],
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, collection: 'announcements' });

// Export Models
module.exports = {
  User: mongoose.model('User', userSchema),
  Report: mongoose.model('Report', reportSchema),
  Bill: mongoose.model('Bill', billSchema),
  Challenge: mongoose.model('Challenge', challengeSchema),
  UserChallenge: mongoose.model('UserChallenge', userChallengeSchema),
  Reward: mongoose.model('Reward', rewardSchema),
  Leaderboard: mongoose.model('Leaderboard', leaderboardSchema),
  Session: mongoose.model('Session', sessionSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Analytics: mongoose.model('Analytics', analyticsSchema),
  Feedback: mongoose.model('Feedback', feedbackSchema),
  Announcement: mongoose.model('Announcement', announcementSchema)
};