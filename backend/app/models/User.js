const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    default: () => 'CIV' + Date.now() + Math.floor(Math.random() * 1000)
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Citizen', 'Worker', 'Municipal Admin', 'NGO'],
    default: 'Citizen'
  },
  points: {
    type: Number,
    default: 50
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  bills: [{
    type: {
      type: String,
      enum: ['electricity', 'water', 'gas', 'internet', 'mobile'],
      required: true
    },
    amount: Number,
    dueDate: Date,
    discount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    billId: String,
    qrCode: String
  }],
  rewards: [{
    title: String,
    discount: Number,
    validUntil: Date,
    used: { type: Boolean, default: false }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Auto-generate userId and track logins
userSchema.pre('save', function(next) {
  if (!this.userId) {
    this.userId = 'CIV' + Date.now() + Math.floor(Math.random() * 1000);
  }
  if (this.isModified('lastLogin')) {
    this.loginCount += 1;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);