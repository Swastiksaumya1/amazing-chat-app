const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET not configured' });
    }
    jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET not configured' });
    }
    jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/authMiddleware').protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
