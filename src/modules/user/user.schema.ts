// import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";
// import { posts } from "../post/post.schema";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: varchar("name").notNull(),
//   email: varchar("email").unique().notNull(),
//   password: text("password").notNull(),
// });

// export const userRelations = relations(users, ({ many }) => ({
//   posts: many(posts),
// }));
