import { pgTable, varchar, text } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: varchar("id", { length: 20 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),  // hashed password
});
