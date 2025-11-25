import mysql from "mysql2/promise";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DB,
  MYSQL_CONN_LIMIT = 10
} = process.env;

export const pool = await mysql.createPool({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB,
  waitForConnections: true,
  connectionLimit: Number(MYSQL_CONN_LIMIT),
  queueLimit: 0,
  namedPlaceholders: false
});

// (opcional) verifica conexión al iniciar
try {
  const [rows] = await pool.query("SELECT 1 AS ok");
  if (rows?.[0]?.ok !== 1) throw new Error("Ping MySQL falló");
  console.log("✅ Conectado a MySQL");
} catch (err) {
  console.error("❌ Error conectando a MySQL:", err.message);
  process.exit(1);
}
