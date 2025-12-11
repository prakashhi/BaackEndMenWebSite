import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "../product/product.schema";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),

  // Category name
  category_name: varchar("category_name", { length: 255 }).notNull(),

  // Parent category (self reference)
  parent_id: integer("parent_id")
    .references(() => categories.id, { onDelete: "set null" }),

  // Category description
  category_desc: varchar("category_desc", { length: 500 }).notNull(),
});

// Relations
export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
