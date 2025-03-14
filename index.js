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
const getFullGymData = async (req) => {
  //關鍵字的參數
  let keyword = req.query.keyword || "";
  let feature = req.query.features || "";
  let friendly = req.query.friendly || "";

  let q_sql = " WHERE 1 "; //就算qs什麼都沒也會是1 = true
  //篩選類別
  const params = [];

  if (feature) {
    const featuresArray = req.query.features
      .split(",")
      .map((feature) => feature.trim());
    q_sql += ` AND features.feature_name IN (${featuresArray
      .map(() => "?")
      .join(",")})`;
    params.push(...featuresArray);
  }

  // 篩選關鍵字
  if (keyword) {
    // const keyword_ = db.escape(`%${keyword}%`);
    // q_sql += ` AND (gym_name LIKE ${keyword_} OR gym_address LIKE ${keyword_}) `;
    q_sql += ` AND (gym_name LIKE ? OR gym_address LIKE ? ) `;
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  if (friendly === true || friendly === "true") {
    q_sql += `AND is_elderly = ?`;
    params.push(friendly);
  }

  const sql = `SELECT gyms.*, GROUP_CONCAT(DISTINCT features.feature_name) AS feature_list, GROUP_CONCAT( gym_images.image_filename) AS image_list FROM Gyms gyms LEFT JOIN GymFeatures AS gym_features ON gyms.gym_id = gym_features.gym_id JOIN Features AS features ON gym_features.feature_id = features.feature_id LEFT JOIN GymImages gym_images ON gyms.gym_id = gym_images.gym_id ${q_sql} GROUP BY gyms.gym_id order by gyms.gym_id desc;`;
  try {
    // 執行 SQL 查詢
    const [rows] = await db.query(sql, params);
    console.log(sql, params);
    // 對每一行數據進行處理
    const processedRows = rows.map((row) => {
      return {
        ...row, // 保留原有的所有屬性
        feature_list: row.feature_list.split(","), // 將 feature_list 轉換為陣列.
        image_list: row.image_list.split(","), // 將 image_list 轉換為陣列
      };
    });

    console.log(processedRows);
    return {
      processedRows,
      qs: req.query,
    };
  } catch (error) {
    console.error("Error fetching gyms:", error);
  }

  console.log("有收到資料Feature:", req.query.features);
  console.log("有收到資料Keyword:", req.query.keyword);
  console.log("有收到資料SQL:", sql);
};
app.get("/gyms", async (req, res) => {
  let data = "";
  try {
    data = await getFullGymData(req);
  } catch (error) {
    console.error("Route error:", error);
    data = { success: false, error: "Internal Server Error" };
  }
  res.json(data);
});
// 啟動服務器
app.listen(port, () => {
  console.log(`服務器運行在 http://localhost:${port}`);
});

export default app;
