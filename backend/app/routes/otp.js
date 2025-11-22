const express = require('express');
const router = express.Router();

// Mock OTP storage
const otpStore = new Map();

// Send OTP
router.post('/send', async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    
    // Generate mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5 minute expiry
    otpStore.set(emailOrPhone, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    });
    
    console.log(`📱 Mock OTP for ${emailOrPhone}: ${otp}`);
    
    res.json({ 
      message: 'OTP sent successfully',
      // In production, don't send OTP in response
      mockOtp: otp // Only for demo
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP and login
router.post('/verify', async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;
    
    const stored = otpStore.get(emailOrPhone);
    
    if (!stored) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }
    
    if (Date.now() > stored.expires) {
      otpStore.delete(emailOrPhone);
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // OTP verified, find user and login
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const user = mockDb.users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);
      if (user) {
        user.lastLogin = new Date();
        user.loginCount += 1;
        
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        otpStore.delete(emailOrPhone);
        
        return res.json({ 
          message: 'Login successful',
          verified: true,
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
    }
    
    otpStore.delete(emailOrPhone);
    res.json({ message: 'OTP verified successfully', verified: true });
  } catch (error) {
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

module.exports = router;