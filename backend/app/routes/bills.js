const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get user bills
router.get('/', auth, async (req, res) => {
  try {
    // Check if using mock database
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const billsData = await mockDb.getUserBills(req.user.userId);
      return res.json(billsData);
    }

    const user = await User.findById(req.user.userId).select('bills rewards');
    res.json({ bills: user.bills, rewards: user.rewards });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay bill
router.post('/:billId/pay', auth, async (req, res) => {
  try {
    // Check if using mock database
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const bill = await mockDb.payBill(req.user.userId, req.params.billId);
      if (!bill) return res.status(404).json({ message: 'Bill not found' });
      return res.json({ message: 'Bill paid successfully', bill });
    }

    const user = await User.findById(req.user.userId);
    const bill = user.bills.id(req.params.billId);
    
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    bill.status = 'paid';
    await user.save();
    
    res.json({ message: 'Bill paid successfully', bill });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate QR code for bill
router.get('/:billId/qr', auth, async (req, res) => {
  try {
    // Check if using mock database
    const mockDb = req.app.get('mockDb');
    if (mockDb) {
      const qrData = await mockDb.getBillQR(req.user.userId, req.params.billId);
      if (!qrData) return res.status(404).json({ message: 'Bill not found' });
      return res.json(qrData);
    }

    const user = await User.findById(req.user.userId);
    const bill = user.bills.id(req.params.billId);
    
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    const qrData = {
      billId: bill.billId,
      amount: bill.amount - (bill.amount * bill.discount / 100),
      type: bill.type,
      userId: user.userId,
      dueDate: bill.dueDate
    };
    
    res.json({ qrCode: bill.qrCode, data: qrData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;