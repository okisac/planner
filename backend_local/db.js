const { Pool } = require("pg");
const path = require("path");
// Bir üst klasördeki .env dosyasını bul diyoruz:
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_Local, // Local veritabanı bağlantısı
});

module.exports = pool;
