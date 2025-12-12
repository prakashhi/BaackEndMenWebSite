import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "../product/product.schema";

export const categories = pgTable("categories", {
  id: varchar("id", { length: 20 }).primaryKey(),

  // Category name
  category_name: varchar("category_name", { length: 255 }).notNull(),

  sub_category: text("sub_category").default("[]"),
  parent_id: varchar("parent_id", { length: 20 }).references(() => categories.id, { onDelete: "set null" }),

  // Category description
  category_desc: varchar("category_desc", { length: 500 }).notNull(),
});

// Relations
export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
