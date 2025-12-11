import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../user/user.schema";
import { products } from "../product/product.schema";

import { uniqueIndex } from "drizzle-orm/pg-core";

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userProductUnique: uniqueIndex("wishlist_user_product_idx")
    .on(table.user_id, table.product_id),
}));


// optionally add unique constraint (user_id, product_id) in SQL migration to prevent duplicates
export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.user_id],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlist.product_id],
    references: [products.id],
  }),
}));
