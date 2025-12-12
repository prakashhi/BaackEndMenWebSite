import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../config/db";
import { products } from "./product.schema";
import { eq } from "drizzle-orm";

import ImageKit from "imagekit";
import { generateCustomId } from "../../plugins/IdGenerate";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export const imageKitAuth = async (req, reply) => {
  const result = imagekit.getAuthenticationParameters();
  return reply.send(result);
};

interface Product {
  name: string; // Product name
  description: string; // Short description
  stock: number; // Number of items in stock
  colors: string[]; // Array of colors (e.g., ["Black", "Brown"])
  discountPrice: number; // Price after discount
  price: number; // Original price
  images: string[]; // Array of image objects
  sub_category:string,
  category_id:string,
}

// Create product
export const createProduct = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    name,
    description,
    stock,
    colors,
    discountPrice,
    sub_category,
    price,
    category_id,
    images,
  } = req.body as Product;
  

  const exists = await db
    .select()
    .from(products)
    .where(eq(products.product_name, name))
    .limit(1);

  if (exists.length > 0) {
    return reply.status(400).send({ message: "Product is already exists" });
  }

  const newID = await generateCustomId(db, products, "PRO");
  const newProduct = await db
    .insert(products)
    .values({
      id: newID,
      product_name: name,
      description,
      price,
      sub_category,
      category_id,
      stock,
      discountPrice,
      product_colors: colors,
      images: JSON.stringify(images),
    })
    .returning();

  return reply.send({ message: "Product created", product: newProduct[0] });
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
  const updated = await db
    .update(products)
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
