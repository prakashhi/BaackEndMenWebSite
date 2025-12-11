import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../user/user.schema";
import { products } from "../product/product.schema";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),

  // User who made the order
  user_id: integer("user_id").references(() => users.id).notNull(),

  // Total price in cents
  total_Amount: integer("total_cents").notNull(),

  // Order status
  status: varchar("status", { length: 50 }).notNull().default("pending"),

  // Shipping address as JSON string
  shipping_address: text("shipping_address"),

  // Payment metadata as JSON string
  payment_metadata: text("payment_metadata"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),

  // Link to order
  order_id: integer("order_id").references(() => orders.id).notNull(),

  // Link to product
  product_id: integer("product_id").references(() => products.id).notNull(),

  qty: integer("qty").notNull().default(1),

  // Price at the time of order
  unit_price_price: integer("unit_price_cents").notNull(),
});

// Relations
export const orderRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  product: one(products, {
    fields: [orderItems.product_id],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
}));
