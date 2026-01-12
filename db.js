const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Kunde inte öppna databasen", err);
  } else {
    console.log("Databasen är ansluten");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS filmer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT NOT NULL,
    genre TEXT NOT NULL,
    ar INTEGER NOT NULL,
    betyg INTEGER NOT NULL,
    tag TEXT NOT NULL
  )
`);

module.exports = db;
