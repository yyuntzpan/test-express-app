import express from "express";
const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const sql = "SELECT * FROM Gyms WHERE gym_id = 1";
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (error) {
    console.error("查詢錯誤:", error);
    res.status(500).json({ error: "資料庫查詢失敗", message: error.message });
  }
});

export default router;
