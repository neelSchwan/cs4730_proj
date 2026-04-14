const db = require("./db");
const { randomUUID } = require("crypto");

// Prepared statement for inserting a new review into the database.
// Uses named parameters (@param) to bind values
const insertReview = db.prepare(`
    INSERT INTO reviews (user_id, rating, subject, description, timestamp, hotness, origin_id)
    VALUES (@user_id, @rating, @subject, @description, @timestamp, @hotness, @origin_id)
`);

// Prepared statement for inserting a review received via gossip.
// origin_id and hotness come from the peer so we don't reset them.
const insertGossipReview = db.prepare(`
    INSERT OR IGNORE INTO reviews (user_id, rating, subject, description, timestamp, hotness, origin_id)
    VALUES (@user_id, @rating, @subject, @description, @timestamp, @hotness, @origin_id)
`);

// Prepared statement for fetching all reviews, newest first
const selectAllReviews = db.prepare(`
  SELECT * FROM reviews ORDER BY timestamp DESC
`);

// Inserts a new review into the database.
// timestamp is tbd, i thoguth it would be required server-side to make sure nodes are consistent
function createReview({ user_id, rating, subject, description }) {
  const row = {                                                                     
    user_id,                                                                        
    rating,                                                                         
    subject,                                                                        
    description,                                                                    
    timestamp: new Date().toISOString(),                                            
    hotness: 5,                                                                     
    origin_id: randomUUID()                                                         
  };                                                                                
  const result = insertReview.run(row);
  return { lastInsertRowid: result.lastInsertRowid, review: { ...row, review_id: result.lastInsertRowid } };                                                       
}

function createGossipReview({ user_id, rating, subject, description, timestamp, hotness, origin_id }) {
  return insertGossipReview.run({ user_id, rating, subject, description, timestamp, hotness, origin_id });
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

module.exports = { createReview, createGossipReview, getAllReviews, createUser, getUserByUsername };