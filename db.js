const Database = require('better-sqlite3');

let db;

try {
    db = new Database(process.env.DB_PATH || 'db.sqlite', { verbose: console.log }); // creates db if doesn't exist
} catch (err) {
    console.error('couldnt to open the db:', err.message);
    process.exit(1);
}

// going to insert timestamp in the query level, not here
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    rating REAL NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    hotness INTEGER NOT NULL DEFAULT 5
  );

  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE
  );
`);

// need to flush sqlite file before close
// probably will matter later when we have multiple servers
process.on('exit', () => db.close()); 
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

module.exports = db;