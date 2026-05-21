// initDb.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const setupDatabase = async () => {
  const queryText = `
    -- 1. Create ENUM for User Roles safely
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('admin', 'user', 'owner');
        END IF;
    END $$;

    -- 2. Create Users Table (Unified structural approach)
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Create Stores Table
    CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Create Ratings Table with Unique Composite Constraint
    CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        store_id INT REFERENCES stores(id) ON DELETE CASCADE,
        rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_store_rating UNIQUE (user_id, store_id)
    );
  `;

  try {
    console.log("Connecting to PostgreSQL & building architecture tables...");
    await pool.query(queryText);
    console.log("All tables initialized perfectly inside PostgreSQL!");
    process.exit(0);
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
};

setupDatabase();