import "dotenv/config"; // load env variables first
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

// Create Postgres pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.trim(),
});

export const db = drizzle(pool);

// Test DB connection
export async function testDbConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("📦 PostgreSQL Connected Successfully!", res.rows[0]);
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error);
  }
}
