import { pgTable, serial, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { carts } from "../cart/cart.schema";
import { orders } from "../order/order.schema";
import { wishlist } from "../wishlist/wishlist.schema";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: text("password").notNull(),
  is_admin: boolean("is_admin").notNull().default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
  wishlist: many(wishlist),
}));
