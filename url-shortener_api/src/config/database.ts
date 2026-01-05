import { Pool } from 'pg';
import { envConfig } from './env';

// Log database config (for debugging)
console.log({
  DB_HOST: envConfig.database.host,
  DB_PORT: envConfig.database.port,
  DB_NAME: envConfig.database.database,
  DB_USER: envConfig.database.user,
});

// Database connection pool
const pool = new Pool({
  host: envConfig.database.host,
  port: envConfig.database.port,
  database: envConfig.database.database,
  user: envConfig.database.user,
  password: envConfig.database.password,
  max: 20, // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log connection events
pool.on('connect', () => {
  console.log('📊 Database connected');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
});

// Health check query
export const dbHealthCheck = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()');
    return !!result.rows;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

export default pool;
