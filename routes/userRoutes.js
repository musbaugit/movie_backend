const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Middleware to verify JWT token
// const auth = async (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) return res.status(401).json({ message: 'No token, auth denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.id;
//     next();
//   } catch {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// POST /favorites - add a movie to favorites
router.post('/favorites', auth, async (req, res) => {
  const movie = req.body;

  try {
    const user = await User.findById(req.user);
    if (!user.favorites.some(m => m.id === movie.id)) {
      user.favorites.push(movie);
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /watchlist - add a movie to watchlist
router.post('/watchlist', auth, async (req, res) => {
  const movie = req.body;

  try {
    const user = await User.findById(req.user);
    if (!user.watchlist.some(m => m.id === movie.id)) {
      user.watchlist.push(movie);
      await user.save();
    }
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /profile - get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({
      username: user.username,
      email: user.email,
      favorites: user.favorites,
      watchlist: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
