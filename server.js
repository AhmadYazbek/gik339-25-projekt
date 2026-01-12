const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/filmer", (req, res) => {
  db.all("SELECT * FROM filmer", (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Databasfel" });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servern kör på http://localhost:${PORT}`);
});
