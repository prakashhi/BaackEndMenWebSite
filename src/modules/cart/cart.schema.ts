import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../user/user.schema";
import { products } from "../product/product.schema";
import { orderItems } from "../order/order.schema"; // not required but left for completeness

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cart_id: integer("cart_id").references(() => carts.id).notNull(),
  product_id: integer("product_id").references(() => products.id).notNull(),
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
