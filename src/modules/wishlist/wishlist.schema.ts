import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../user/user.schema";
import { products } from "../product/product.schema";

import { uniqueIndex } from "drizzle-orm/pg-core";

export const wishlist = pgTable("wishlist", {
  id: varchar("id", { length: 20 }).primaryKey(),
  user_id: varchar("user_id", { length: 20 }).references(() => users.id).notNull(),
  product_id: varchar("product_id", { length: 20 }).references(() => products.id).notNull(),
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
