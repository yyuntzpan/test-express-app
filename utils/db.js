import mysql from "mysql2/promise";

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

let pool = null;
const getPool = async () => {
  if (pool) return pool;

  pool = await mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("資料庫連接成功！");
  return pool;
};

getPool().catch((err) => {
  console.error("資料庫連接錯誤:", err);
  process.exit(1);
});

export default getPool ;
