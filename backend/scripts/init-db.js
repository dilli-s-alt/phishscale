import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const initDb = async () => {
  console.log("Initializing database...");
  
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Creating tables...");
    
    // Users table for auth
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Campaigns table
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        template TEXT,
        landing_page VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Targets (Employees) table
    await client.query(`
      CREATE TABLE IF NOT EXISTS targets (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Junction table for campaign results
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaign_targets (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id),
        target_id INTEGER REFERENCES targets(id),
        tracking_id VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Events table (tracking opens/clicks)
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        tracking_id VARCHAR(100),
        type VARCHAR(50) NOT NULL, -- 'open', 'click', 'submitted'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("✅ Database initialized successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Database initialization failed:", error.message);
  } finally {
    client.release();
    pool.end();
  }
};

initDb();
