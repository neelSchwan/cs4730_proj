const db = require("./db");

// Prepared statement for inserting a new review into the database.
// Uses named parameters (@param) to bind values
const insertReview = db.prepare(`
    INSERT INTO reviews (user_id, rating, subject, description, timestamp)
    VALUES (@user_id, @rating, @subject, @description, @timestamp)
`);

// Prepared statement for fetching all reviews, newest first
const selectAllReviews = db.prepare(`
  SELECT * FROM reviews ORDER BY timestamp DESC
`);

// Inserts a new review into the database.
// timestamp is tbd, i thoguth it would be required server-side to make sure nodes are consistent
function createReview({ user_id, rating, subject, description }) {
  return insertReview.run({
    user_id,
    rating,
    subject,
    description,
    timestamp: new Date().toISOString()
  });
}

// Returns all reviews as an array of objects, ordered by most recent first
function getAllReviews() {
    return selectAllReviews.all();
}

// Prepared statement for inserting a new user into the database.
const insertUser = db.prepare(`
  INSERT INTO users (username) VALUES (@username)
`);

// Prepared statement for fetching a user by their username.
const selectUserByUsername = db.prepare(`
  SELECT * FROM users WHERE username = @username
`);

// Inserts a new user into the database and returns the result.
function createUser({ username }) {
  return insertUser.run({ username });
}

// Returns a single user object matching the given username, or undefined if not found.
function getUserByUsername({ username }) {
  return selectUserByUsername.get({ username });
}

module.exports = { createReview, getAllReviews, createUser, getUserByUsername};