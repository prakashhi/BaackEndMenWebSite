// src/modules/user/user.routes.ts
import { FastifyInstance } from "fastify";
import {
  userGetProfileData,
  userLoginHandler,
  userLogoutHandler,
  userRegisterHandler,
} from "./user.controller";
import { userAuth } from "../../middleware/auth";

export default async function userRoutes(app: FastifyInstance) {
  app.post("/user/login", userLoginHandler);

  app.post("/user/register", userRegisterHandler);

  app.post("/user/logout", userLogoutHandler);

  app.get("/user/me", { preHandler: userAuth }, userGetProfileData);
}
