import { FastifyInstance } from "fastify";
import {
  createCategoryHandler,
  getCategoriesHandler,
} from "./category.controller";

export default async function categoryRoutes(app: FastifyInstance) {
  app.post("/category/Add", createCategoryHandler);
  app.get("/category/get", getCategoriesHandler);
}
