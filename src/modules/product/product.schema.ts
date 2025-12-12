import { pgTable, varchar, text, integer, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { cartItems } from "../cart/cart.schema";
import { orderItems } from "../order/order.schema";
import { wishlist } from "../wishlist/wishlist.schema";
import { categories } from "../productCategory/category.schema"; // import category table

export const products = pgTable("products", {
  id: varchar("id", { length: 20 }).primaryKey(),
  product_name: varchar("product_name", { length: 500 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  discount_price: integer("discount_price"),
  category_id: varchar("category_id", { length: 20 }).references(() => categories.id),
  sub_category:varchar("",{ length: 500 }),
  images: text("images_json").default("[]").notNull(),
  product_colors: json("product_colors").default("[]").notNull(),
  stock: integer("stock").notNull().default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const productRelations = relations(products, ({ many, one }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  wishlist: many(wishlist),
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
}));
