const db = require("./db");

const insertReview = db.prepare(`
    INSERT INTO reviews (user_id, rating, subject, description, timestamp)
    VALUES (@user_id, @rating, @subject, @description, @timestamp)
`);

const selectAllReviews = db.prepare(`
  SELECT * FROM reviews ORDER BY timestamp DESC
`);

function createReview({ user_id, rating, subject, description }) {
  return insertReview.run({
    user_id,
    rating,
    subject,
    description,
    timestamp: new Date().toISOString()
  });
}

function getAllReviews() {
    return selectAllReviews.all();
}
module.exports = { createReview, getAllReviews };