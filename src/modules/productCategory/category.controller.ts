import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../config/db";
import { categories } from "./category.schema";
import { eq } from "drizzle-orm";

export const createCategoryHandler = async (
  req: FastifyRequest<{ Body: { name: string; description: string } }>,
  reply: FastifyReply
) => {
  const { name, description } = req.body;

  const exists = await db
    .select()
    .from(categories)
    .where(eq(categories.category_name, name))
    .limit(1);

  if (exists.length > 0) {
    return reply.status(400).send({ msg: "Category already exists" });
  }

  await db
    .insert(categories)
    .values({ category_name: name, category_desc: description });

  reply.send({ msg: "Category created successfully" });
};

export const getCategoriesHandler = async () => {
  return await db.select().from(categories);
};
