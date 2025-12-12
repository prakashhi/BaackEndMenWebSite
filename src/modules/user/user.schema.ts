import {
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { carts } from "../cart/cart.schema";
import { orders } from "../order/order.schema";
import { wishlist } from "../wishlist/wishlist.schema";


export const users = pgTable("users", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
 mobile_no: varchar("mobile_no", { length: 10 }).notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
  wishlist: many(wishlist),
}));
