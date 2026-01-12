// Importerar nödvändiga paket
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Skapar Express-app
const app = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
// Gör så att vi kan ta emot JSON från frontend
app.use(express.json());

// Serverar frontend-filer (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, "../client")));

// ===== SQLITE-DATABAS =====
// Sökväg till databasen
const dbPath = path.join(__dirname, "database.db");

// Öppnar databasen
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Kunde inte öppna databasen:", err);
  } else {
    console.log("Databasen är ansluten");
  }
});

// Skapar tabellen filmer om den inte redan finns
db.run(`
  CREATE TABLE IF NOT EXISTS filmer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT NOT NULL,
    genre TEXT NOT NULL,
    ar INTEGER NOT NULL,
    betyg REAL NOT NULL
  )
`);

// ===== ROUTE FÖR STARTSIDAN =====
// Skickar index.html när användaren går till /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ===== API – CRUD =====

// GET – hämtar alla filmer
app.get("/filmer", (req, res) => {
  db.all("SELECT * FROM filmer", (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Databasfel" });
    } else {
      res.json(rows);
    }
  });
});

// POST – lägger till en ny film
app.post("/filmer", (req, res) => {
  const { titel, genre, ar, betyg } = req.body;

  // Enkel validering
  if (!titel || !genre || !ar || !betyg) {
    return res.status(400).json({ message: "Alla fält måste fyllas i" });
  }

  const sql = `
    INSERT INTO filmer (titel, genre, ar, betyg)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [titel, genre, ar, betyg], function (err) {
    if (err) {
      res.status(500).json({ message: "Kunde inte spara filmen" });
    } else {
      res.json({ message: "Film skapad", id: this.lastID });
    }
  });
});

// PUT – uppdaterar en befintlig film
app.put("/filmer", (req, res) => {
  const { id, titel, genre, ar, betyg } = req.body;

  const sql = `
    UPDATE filmer
    SET titel = ?, genre = ?, ar = ?, betyg = ?
    WHERE id = ?
  `;

  db.run(sql, [titel, genre, ar, betyg, id], function (err) {
    if (err) {
      res.status(500).json({ message: "Kunde inte uppdatera filmen" });
    } else {
      res.json({ message: "Film uppdaterad" });
    }
  });
});

// DELETE – tar bort en film
app.delete("/filmer/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM filmer WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ message: "Kunde inte ta bort filmen" });
    } else {
      res.json({ message: "Film borttagen" });
    }
  });
});

// ===== STARTAR SERVERN =====
app.listen(PORT, () => {
  console.log(`Servern kör på http://localhost:${PORT}`);
});
