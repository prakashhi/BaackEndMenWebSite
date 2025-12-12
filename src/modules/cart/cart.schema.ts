import { pgTable, varchar, timestamp,integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../user/user.schema";
import { products } from "../product/product.schema";
import { orderItems } from "../order/order.schema"; // not required but left for completeness

export const carts = pgTable("carts", {
  id: varchar("id", { length: 20 }).primaryKey(),
  user_id: varchar("user_id", { length: 20 }).references(() => users.id).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id", { length: 20 }).primaryKey(),
  cart_id: varchar("cart_id", { length: 20 }).references(() => carts.id).notNull(),
  product_id: varchar("product_id", { length: 20 }).references(() => products.id).notNull(),
  qty: integer("qty").notNull().default(1),
  added_at: timestamp("added_at").defaultNow().notNull(),
});

export const cartRelations = relations(carts, ({ many, one }) => ({
  items: many(cartItems),
  user: one(users, {
    fields: [carts.user_id],
    references: [users.id],
  }),
}));

export const cartItemRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.product_id],
    references: [products.id],
  }),
  cart: one(carts, {
    fields: [cartItems.cart_id],
    references: [carts.id],
  }),
}));
