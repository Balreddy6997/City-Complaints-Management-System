const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AdminCode = require('../models/AdminCode');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, address, adminCode } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if email already exists
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // Validate admin code if registering as admin
    if (role === 'admin') {
      if (!adminCode) {
        return res.status(400).json({ 
          message: 'Admin registration code is required' 
        });
      }
      const codeDoc = await AdminCode.findOne({ code: adminCode.toUpperCase() });
      if (!codeDoc) {
        return res.status(400).json({ 
          message: 'Invalid admin code. Contact system administrator.' 
        });
      }
      if (codeDoc.used) {
        return res.status(400).json({ 
          message: 'This admin code has already been used.' 
        });
      }
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'citizen',
      phone: phone || '',
      address: address || ''
    });

    // Mark admin code as used after user creation
    if (role === 'admin') {
      const codeDoc = await AdminCode.findOne({ 
        code: adminCode.toUpperCase() 
      });
      codeDoc.used   = true;
      codeDoc.usedBy = user._id;
      codeDoc.usedAt = new Date();
      await codeDoc.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration: ' + err.message });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login: ' + err.message });
  }
});

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
// GET /api/auth/me
const { protect } = require('../middleware/authMiddleware');
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;