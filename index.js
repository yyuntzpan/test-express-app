import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2/promise";
const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

// 測試資料庫連接的路由
app.get("/api/test-db", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    await connection.query("SELECT 1");
    res.json({ success: true, message: "資料庫連接成功！" });
  } catch (error) {
    console.error("資料庫連接錯誤:", error);
    res.status(500).json({
      success: false,
      message: "資料庫連接失敗",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// 簡單的首頁路由
app.get("/", (req, res) => {
  res.send("Express 應用程式運行中！訪問 /api/test-db 來測試資料庫連接");
});

app.get("/test", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = "SELECT * FROM Gyms WHERE gym_id = 1";
    const [rows] = await connection.query(sql);
    res.json(rows);
  } catch (error) {
    console.error("查詢錯誤:", error);
    res.status(500).json({ error: "資料庫查詢失敗", message: error.message });
  }
});
// 啟動服務器
app.listen(port, () => {
  console.log(`服務器運行在 http://localhost:${port}`);
});

export default app;
