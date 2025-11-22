const express = require('express');
const { sendOtp } = require('../services/smsService');
const router = express.Router();

/**
 * @route   POST /api/auth/send-otp
 * @desc    Generate and send an OTP to a user's phone number
 * @access  Public
 */
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // In a real application, you would save this OTP and its expiry time
  // in your database (e.g., in the User model) to verify it later.

  try {
    const success = await sendOtp(phoneNumber, otp);
    if (success) {
      res.status(200).json({ message: 'OTP sent successfully.' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sending the OTP.' });
  }
});

module.exports = router;