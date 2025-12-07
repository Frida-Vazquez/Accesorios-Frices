// src/db/pool.js
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Frida",
  password: process.env.DB_PASSWORD || "frices25",
  database: process.env.DB_NAME || "AccesoriosFrices",
  port: process.env.DB_PORT || 3306,
});
