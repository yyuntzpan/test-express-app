import express from "express";
import getPool from "./utils/db.js";

import testRouter from "./routes/test.js";

const app = express();
const port = process.env.PORT || 3000;

//設定中間件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 註冊路由
app.use("/api/test", testRouter);

// 測試資料庫連接的路由
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
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

// 啟動服務器
async function startServer() {
  try {
    await getPool();

    app.listen(port, () => {
      console.log(`服務器運行在 http://localhost:${port}`);
    });
  } catch (error) {
    console.error("啟動伺服器失敗:", error);
  }
}
startServer();

export default app;
