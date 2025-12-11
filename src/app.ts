import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import swaggerPlugin from "./plugins/swagger";
import adminRoutes from "./modules/admin/admin.routes";
import cookie from "@fastify/cookie";

import categoryRoutes from "./modules/productCategory/category.route";

import { testDbConnection } from "../src/config/db";
import productRoutes from "./modules/product/product.route";

export async function buildApp() {
  const app = Fastify();
  await testDbConnection();
  app.register(swaggerPlugin);

  app.register(cors, {
    origin: process.env.FORTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allows cookies or credentials
  });

  app.register(cookie, {
    secret: process.env.COOKIE_SECRET, // for signed cookies
    hook: "onRequest",
  });

  app.register(jwt, { secret: process.env.JWT_SECRET });

  app.register(swagger, {
    openapi: {
      info: {
        title: "Fastify API",
        version: "1.0.0",
      },
    },
  });

  app.register(swaggerUI);

  app.register(adminRoutes);
  app.register(categoryRoutes);
  app.register(productRoutes);

  return app;
}
