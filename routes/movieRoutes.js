const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// GET /search?q=batman
router.get('/search', async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
      },
    });

    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'TMDB search failed' });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'TMDB fetch failed' });
  }
});

module.exports = router;
