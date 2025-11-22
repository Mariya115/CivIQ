const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, phone, password, role, firstName, lastName } = req.body;

    // Check if using mock database
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const existingUser = await mockDb.findUser({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await mockDb.createUser({
        email,
        phone,
        password: password, // Store actual password for mock
        role: role || 'Citizen',
        firstName,
        lastName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          userId: user.userId,
          email: user.email,
          phone: user.phone,
          role: user.role,
          points: user.points,
          profile: user.profile
        }
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      email,
      phone,
      password,
      role: role || 'Citizen',
      profile: { 
        firstName, 
        lastName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode
      }
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        points: user.points
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/signin
// @desc    Login user
// @access  Public
router.post('/signin', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Check if using mock database
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const user = mockDb.users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Store login session
      user.lastLogin = new Date();
      
      const token = generateToken(user._id);
      return res.json({
        token,
        user: {
          id: user._id,
          userId: user.userId,
          email: user.email,
          phone: user.phone,
          role: user.role,
          points: user.points,
          profile: user.profile
        }
      });
    }

    // Check if user exists by email or phone
    const user = await User.findOne({ 
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        role: user.role,
        points: user.points,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;