const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Submit complaint with optional photos
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    console.log('📸 Files received:', req.files?.map(f=> ({name: f.filename, size: f.size})));
    console.log('📝 Body received:', req.body);

    const { title, description, category, priority, district, location } = req.body;
    
    // basic validation
    if (!district) {
      return res.status(400).json({ message: 'District is required' });
    }

    // Ensure files were uploaded successfully
    if (!req.files || req.files.length === 0) {
      console.log('⚠️  No files uploaded');
    }
    
    const images = req.files ? req.files.map(f => f.filename) : [];
    console.log('💾 Storing images in DB:', images);
    
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      district,
      location: JSON.parse(location || '{"address":""}'),
      images,
      citizen: req.user._id,
    });
    
    console.log('✅ Complaint created:', complaint._id);
    res.status(201).json(complaint);
  } catch (err) {
    console.error('❌ Complaint error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get my complaints (citizen)
router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user._id }).sort('-createdAt');
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all complaints (admin/officer)
router.get('/', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('citizen', 'name email')
      .populate('assignedTo', 'name')
      .sort('-createdAt');
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update complaint
router.put('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;