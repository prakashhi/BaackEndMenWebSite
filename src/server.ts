import { buildApp } from "./app";
import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config();

(async () => {
  const app = await buildApp();

  await app.listen({ port: Number(process.env.PORT) });

  console.log("Server running on port:", process.env.PORT);
})();
