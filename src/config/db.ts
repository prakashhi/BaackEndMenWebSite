import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);


// Test connection
export async function testDbConnection() {
  try {
    await pool.query("SELECT NOW()");
    console.log("📦 PostgreSQL Connected Successfully!");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error);
  }
}