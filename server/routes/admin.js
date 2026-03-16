const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const total    = await Complaint.countDocuments();
    const pending  = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const users    = await User.countDocuments({ role: 'citizen' });

    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ total, pending, resolved, inProgress, users, byCategory });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// District stats
router.get('/district-stats', protect, adminOnly, async (req, res) => {
  try {
    const districtStats = await Complaint.aggregate([
      {
        $group: {
          _id:        "$district",
          total:      { $sum: 1 },
          resolved:   { $sum: { $cond: [{ $eq: ["$status","Resolved"]   }, 1, 0] } },
          pending:    { $sum: { $cond: [{ $eq: ["$status","Pending"]    }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ["$status","In Progress"]}, 1, 0] } },
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(districtStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all registered users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;