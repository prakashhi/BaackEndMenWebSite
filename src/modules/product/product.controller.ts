import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../config/db";
import { products } from "./product.schema";
import { eq } from "drizzle-orm";

// Create product
export const createProduct = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, description, price, category_id, image } = req.body as any;

  const newProduct = await db.insert(products).values({
    name,
    description,
    price,
    category_id,
    image,
  }).returning();

  return reply.send({ msg: "Product created", product: newProduct[0] });
};

// Get all products
export const getProducts = async (req: FastifyRequest, reply: FastifyReply) => {
  const allProducts = await db.select().from(products);
  return reply.send(allProducts);
};

// Get single product
export const getProductById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const product = await db.query.products.findFirst({
    where: eq(products.id, Number(req.params.id)),
  });

  if (!product) return reply.status(404).send({ msg: "Product not found" });

  return reply.send(product);
};

// Update product
export const updateProduct = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const updated = await db.update(products)
    .set(req.body as any)
    .where(eq(products.id, Number(req.params.id)))
    .returning();

  return reply.send({ msg: "Product updated", product: updated[0] });
};

// Delete product
export const deleteProduct = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  await db.delete(products).where(eq(products.id, Number(req.params.id)));

  return reply.send({ msg: "Product deleted" });
};
