// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // PostgreSQL bağlantısı

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashed],
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, // Buraya 'id: user.id' ekledik!
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ token, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
