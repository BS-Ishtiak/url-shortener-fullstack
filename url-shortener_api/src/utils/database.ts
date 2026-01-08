import pool, { dbHealthCheck } from "../config/database";
import { runMigrations } from "../migrations/init";


export const initializeDatabase = async (): Promise<void> => {
  try {
    
    const isHealthy = await dbHealthCheck();

    if (!isHealthy) {
      throw new Error("Database health check failed");
    }

    await runMigrations();

   
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database:", error);
  }
};
