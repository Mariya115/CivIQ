const express = require('express');
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

// @route   GET /api/reports
// @desc    Get all reports
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'email role')
      .populate('assignedTo', 'email role')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reports
// @desc    Create new report
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const reportData = {
      ...req.body,
      reportedBy: req.user.userId
    };

    const report = new Report(reportData);
    await report.save();

    // Award points to user
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { points: 50 }
    });

    await report.populate('reportedBy', 'email role');
    
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reports/:id
// @desc    Update report
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Update report
    Object.assign(report, req.body);
    
    // If status changed to resolved, award points and set resolved info
    if (req.body.status === 'resolved' && report.status !== 'resolved') {
      report.resolvedBy = req.user.userId;
      report.resolvedAt = new Date();
      
      // Award points to resolver
      await User.findByIdAndUpdate(req.user.userId, {
        $inc: { points: 20 }
      });
    }

    await report.save();
    await report.populate(['reportedBy', 'assignedTo', 'resolvedBy'], 'email role');
    
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;