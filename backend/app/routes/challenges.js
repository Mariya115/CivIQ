const express = require('express');
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get all challenges
router.get('/', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join challenge
router.post('/:id/join', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const userChallenge = new UserChallenge({
      userId: req.user.userId,
      challengeId: req.params.id
    });

    await userChallenge.save();
    await Challenge.findByIdAndUpdate(req.params.id, { $inc: { participants: 1 } });

    res.status(201).json(userChallenge);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete challenge
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const userChallenge = await UserChallenge.findOne({
      userId: req.user.userId,
      challengeId: req.params.id
    }).populate('challengeId');

    if (!userChallenge) return res.status(404).json({ message: 'Challenge not found' });

    userChallenge.status = 'completed';
    userChallenge.completedAt = new Date();
    userChallenge.pointsEarned = userChallenge.challengeId.points;
    userChallenge.progress = 100;

    await userChallenge.save();
    await User.findByIdAndUpdate(req.user.userId, { $inc: { points: userChallenge.challengeId.points } });

    res.json(userChallenge);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;