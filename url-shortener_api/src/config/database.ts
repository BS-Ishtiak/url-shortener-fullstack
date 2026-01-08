import { Pool } from "pg";
import { envConfig } from "./env";

const pool = new Pool({
  host: envConfig.database.host,
  port: envConfig.database.port,
  database: envConfig.database.database,
  user: envConfig.database.user,
  password: envConfig.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("Database connected");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client:", err);
});

export const dbHealthCheck = async (): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT NOW()");
    return !!result.rows;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};

export default pool;
