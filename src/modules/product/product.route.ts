import { FastifyInstance } from "fastify";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  imageKitAuth,
} from "./product.controller";

import { createProductSchema, updateProductSchema } from "./product.validation";

export default async function productRoutes(app: FastifyInstance) {
  app.get("/imagekit/auth", imageKitAuth);
  app.post("/product/create", { schema: createProductSchema }, createProduct);

  app.get("/product/get", getProducts);

  app.get("/product/get/:id", getProductById);

  app.put(
    "/product/update/:id",
    { schema: updateProductSchema },
    updateProduct
  );

  app.delete("/product/delete/:id", deleteProduct);
}
