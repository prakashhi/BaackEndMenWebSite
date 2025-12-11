import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/modules/**/*.schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",          // ✔ instead of driver: "pg"
  dbCredentials: {
    url: process.env.DATABASE_URL!,   // ✔ correct key
  },
} satisfies Config;
