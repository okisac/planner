const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5001; // React genelde 5173'te çalışır, çakışmasın diye 5001 yaptık

// Middleware
app.use(cors());
app.use(express.json()); // JSON verilerini okuyabilmek için

// PostgreSQL Bağlantı Ayarları (Pool kullanımı en profesyonel yoldur)
const pool = new Pool({
  user: "postgres", // Default kullanıcı
  host: "localhost", // Senin bilgisayarın
  database: "postgres", // Tabloyu hangi DB'ye açtıysan (genelde postgres)
  password: "root", // BURAYA KENDİ ŞİFRENİ YAZ
  port: 5432, // Kurulumda seçtiğin port
});

// Veritabanı Bağlantı Testi
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Veritabanına bağlanırken hata oluştu:", err.stack);
  }
  console.log("PostgreSQL veritabanına başarıyla bağlandık! 🚀");
  release();
});

// --- API ENDPOINT'LERİ BURAYA GELECEK ---
// 1. Tüm Görevleri Getir (READ)
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu hatası");
  }
});

// 2. Yeni Görev Ekle (CREATE)
app.post("/api/tasks", async (req, res) => {
  try {
    const { id, title, is_completed, created_at, completed_at } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (id, title, is_completed, created_at, completed_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, title, is_completed, created_at, completed_at],
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ekleme hatası");
  }
});

// 3. Görevi Güncelle (UPDATE - Toggle)
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed, completed_at } = req.body;
    const updateTask = await pool.query(
      "UPDATE tasks SET is_completed = $1, completed_at = $2 WHERE id = $3 RETURNING *",
      [is_completed, completed_at, id],
    );
    res.json(updateTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Güncelleme hatası");
  }
});

// 4. Görevi Sil (DELETE)
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Görev silindi" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Silme hatası");
  }
});

// Sunucuyu Başlat
app.listen(port, () => {
  console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor.`);
});
