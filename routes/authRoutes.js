const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN ATTEMPT:", email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        watchlist: user.watchlist,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get('/debug/users', async (req, res) => {
//   const users = await User.find({});
//   res.json(users);
// });

  router.get('/api/auth/debug/users', async (req, res) => {
  try {
      const users = await User.find();
      res.json(users);
  } catch (err) {
      console.error('❌ Error in /api/auth/debug/users:', err.message);
      res.status(500).json({ error: 'Server error', details: err.message });
  }
});



module.exports = router;
