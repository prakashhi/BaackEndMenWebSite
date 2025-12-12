import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../config/db";
import { categories } from "./category.schema";
import { eq } from "drizzle-orm";
import { generateCustomId } from "../../plugins/IdGenerate";

export const createCategoryHandler = async (
  req: FastifyRequest<{
    Body: { name: string; description: string; sub_Cat: string[] };
  }>,
  reply: FastifyReply
) => {
  const { name, description, sub_Cat } = req.body;


  const exists = await db
    .select()
    .from(categories)
    .where(eq(categories.category_name, name))
    .limit(1);

  if (exists.length > 0) {
    return reply.status(400).send({ message: "Category already exists" });
  }

  const newID = await generateCustomId(db,categories,"CAT");

  await db.insert(categories).values({
    id: newID,
    category_name: name,
    category_desc: description,
    sub_category: JSON.stringify(sub_Cat),
  });

  reply.send({ message: "Category created successfully" });
};

export const getCategoriesHandler = async () => {
  return await db.select().from(categories);
};
