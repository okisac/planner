const express = require("express");
const pool = require("./db");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 5001; // React genelde 5173'te çalışır, çakışmasın diye 5001 yaptık

// Middleware
app.use(cors());
app.use(express.json()); // JSON verilerini okuyabilmek için

// --- 1. TOKEN DOĞRULAMA MIDDLEWARE ---
// Bu fonksiyon, gelen isteğin içindeki token'ı kontrol eder ve user_id'yi req.user içine atar.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN" formatından token'ı al

  if (!token)
    return res
      .status(401)
      .json({ message: "Erişim reddedildi, token bulunamadı." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Geçersiz veya süresi dolmuş token." });
    req.user = user; // Token içindeki kullanıcı bilgilerini (id vb.) isteğe ekle
    next();
  });
};

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Veritabanı Bağlantı Testi
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Veritabanına bağlanırken hata oluştu:", err.stack);
  }
  console.log("PostgreSQL veritabanına başarıyla bağlandık! 🚀");
  release();
});

// --- API ENDPOINT'LERİ (GÜNCELLENDİ) ---

// 1. Sadece Giriş Yapan Kullanıcının Görevlerini Getir
app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Token'dan gelen ID

    // KRİTİK SATIR: Sadece bu kullanıcıya ait olanları çek
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu hatası");
  }
});

// 2. Yeni Görev Ekle (server.js içinde)
app.post("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Token'dan gelen güvenli ID
    const {
      id,
      title,
      task_type,
      is_completed,
      created_at,
      completed_at,
      deadline_date,
    } = req.body;

    const newTask = await pool.query(
      "INSERT INTO tasks (id, title, task_type, is_completed, created_at, completed_at, deadline_date, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        id,
        title,
        task_type || "single",
        is_completed || false,
        created_at || new Date(), // Eğer frontend göndermezse şu anki zamanı al
        completed_at || null,
        deadline_date || null,
        userId, // Burası kritik!
      ],
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error("DB Hatası:", err.message);
    res.status(500).send("Ekleme hatası: " + err.message);
  }
});

// 3. Görevi Güncelle (Sadece kendi görevini güncelleyebilir)
app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { is_completed, completed_at, title } = req.body;

    // Güvenlik kontrolü: Bu görev gerçekten bu kullanıcıya mı ait?
    const existingTask = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (existingTask.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Görev bulunamadı veya yetkiniz yok." });
    }

    const updatedTitle =
      title !== undefined ? title : existingTask.rows[0].title;
    const updatedIsCompleted =
      is_completed !== undefined
        ? is_completed
        : existingTask.rows[0].is_completed;
    const updatedCompletedAt =
      completed_at !== undefined
        ? completed_at
        : existingTask.rows[0].completed_at;

    const updateTask = await pool.query(
      "UPDATE tasks SET title = $1, is_completed = $2, completed_at = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [updatedTitle, updatedIsCompleted, updatedCompletedAt, id, userId],
    );

    res.json(updateTask.rows[0]);
  } catch (err) {
    console.error("Güncelleme hatası:", err.message);
    res.status(500).send("Güncelleme hatası");
  }
});

// 4. Görevi Sil (Sadece kendi görevini silebilir)
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Görev bulunamadı veya yetkiniz yok." });
    }

    res.json({ message: "Görev silindi" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Silme hatası");
  }
});

app.listen(port, () => {
  console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor.`);
});

module.exports = pool;
