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
module.exports = { createReview, getAllReviews };