const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get current session info
router.get('/current', auth, async (req, res) => {
  try {
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const user = mockDb.users.find(u => u._id === req.user.userId);
      if (user) {
        return res.json({
          session: {
            userId: user.userId,
            email: user.email,
            phone: user.phone,
            lastLogin: user.lastLogin,
            loginCount: user.loginCount,
            isActive: true
          }
        });
      }
    }
    
    res.json({ session: { isActive: true } });
  } catch (error) {
    res.status(500).json({ message: 'Session error' });
  }
});

module.exports = router;