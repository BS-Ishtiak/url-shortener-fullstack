import pool, { dbHealthCheck } from '../config/database';
import { runMigrations } from '../migrations/init';

// Initialize database
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Checking database connection...');
    const isHealthy = await dbHealthCheck();

    if (!isHealthy) {
      throw new Error('Database health check failed');
    }

    console.log('✅ Database connection successful');

    // Run migrations
    await runMigrations();

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Close database connection
export const closeDatabase = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
  }
};
