import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

let pool = null;
const getPool = async () => {
  if (pool) return pool;

  try {
    pool = await mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      port: DB_PORT || 3306, // 添加默認端口
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("資料庫連接成功！");
    console.log(
      `連接參數: 主機=${DB_HOST}, 用戶=${DB_USER}, 資料庫=${DB_NAME}, 端口=${DB_PORT}`
    );
    return pool;
  } catch (err) {
    console.error("資料庫連接錯誤:", err);
    throw err; // 重新拋出錯誤以便調用者處理
  }
};

export default getPool;
