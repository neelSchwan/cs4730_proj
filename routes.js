const express = require('express');
const router = express.Router();
const { createReview, getAllReviews, createUser, getUserByUsername} = require('./queries');


// POST /reviews
// accepts a new review from the client and stores it in the database.
// user_id is trusted from the request body for now
router.post('/reviews', (req, res) => {
    const { user_id, rating, subject, description } = req.body;

    // need to add validation later
    // probably checking rating number and if the other fields exist
    try {
        const result = createReview({user_id, rating, subject, description});
        res.status(201).json({review_id: result.lastInsertRowid});
    } catch (err) {
        console.error('couldnt insert review:', err.message);
        res.status(500).json({ error: 'Something went wrong!'});
    }
});

// GET /reviews 
// returns all reviews from the database, ordered by most recent first
router.get('/reviews', (req, res) => {
    try {
        const reviews = getAllReviews()
        res.status(200).json(reviews);
    } catch (err) {
        console.error('couldnt get reviews:', err.message);
        res.status(500).json({error: 'Something went wrong!'})
    }
})

// POST /users
// registers a new username and returns their user_id.
// If the username already exists, returns their existing user_id instead.
// This allows clients to recover their user_id without a formal login system.
// TODO: maybe replace with proper auth once login system is implemented
router.post('/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  const existing = getUserByUsername({ username });
  if (existing) {
    return res.status(200).json({ user_id: existing.user_id });
  }

  try {
    const result = createUser({ username });
    res.status(201).json({ user_id: result.lastInsertRowid });
  } catch (err) {
    console.error('couldnt create user:', err.message);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;