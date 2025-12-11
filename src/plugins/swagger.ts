import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default async function swaggerPlugin(app: FastifyInstance) {
  // Swagger JSON documentation
  await app.register(swagger, {
    swagger: {
      info: {
        title: "MenWebsite API Docs",
        description: "API documentation for Fastify + Drizzle backend",
        version: "1.0.0",
      },
      tags: [
        { name: "Auth", description: "Authentication routes" },
        { name: "Admin", description: "Admin routes" },
        { name: "Users", description: "User routes" },
        { name: "Products", description: "Product routes" },
      ],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  // Swagger UI
  await app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });
}
