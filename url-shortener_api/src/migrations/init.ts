import pool from "../config/database";

// Create users table
export const createUsersTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `;

  await pool.query(query);
  console.log("✅ Users table created");
};

// Create urls table
export const createUrlsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS urls (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_url TEXT NOT NULL,
      short_code VARCHAR(10) UNIQUE NOT NULL,
      clicks INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
    CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
  `;

  await pool.query(query);
  console.log("✅ URLs table created");
};

// Create analytics table
export const createAnalyticsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS analytics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      url_id UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
      ip_address VARCHAR(45),
      user_agent TEXT,
      referrer TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_analytics_url_id ON analytics(url_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
  `;

  await pool.query(query);
  console.log("✅ Analytics table created");
};

// Run all migrations
export const runMigrations = async (): Promise<void> => {
  try {
    console.log("🔄 Running migrations...");
    await createUsersTable();
    await createUrlsTable();
    await createAnalyticsTable();
    console.log("✅ All migrations completed");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};
