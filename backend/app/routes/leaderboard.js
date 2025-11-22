const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get leaderboard
router.get('/', auth, async (req, res) => {
  try {
    // Check if using mock database
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const leaderboard = await mockDb.getLeaderboard();
      return res.json(leaderboard);
    }

    const users = await User.find({ isActive: true })
      .select('userId profile.firstName profile.lastName points')
      .sort({ points: -1 })
      .limit(20);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      points: user.points,
      badge: index < 5 ? 'Top Performer' : index < 10 ? 'High Achiever' : 'Active Citizen'
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;