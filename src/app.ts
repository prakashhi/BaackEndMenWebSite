import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";

export async function buildApp() {
  const app = Fastify();

  app.register(cors);
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

//   app.register(import("./modules/user/user.route"));
//   app.register(import("./modules/post/post.route"));

  return app;
}
