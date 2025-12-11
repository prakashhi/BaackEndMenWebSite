import { FastifyInstance } from "fastify";
import { adminLoginService } from "./admin.service";
import jwt from "jsonwebtoken";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createAdminSchema } from "./SchemaType/adminSchema";
import { createAdminHandler } from "./admin.createController";

export default async function adminRoutes(app: FastifyInstance) {
  app.post("/admin/login", async (req, reply) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const admin = await adminLoginService(email, password);

      const token = jwt.sign(
        { id: admin.id, role: "admin" },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      reply.setCookie("admin_token", token, {
        path: "/",
        httpOnly: true,
        secure: false, // true in production https
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({
        message: "Login successful",
        token,
      });
    } catch (err: any) {
      console.log(err);
      return reply.status(400).send({ error: err.message });
    }
  });

  app.post(
    "/admin/create",
    {
      schema: {
        body: zodToJsonSchema(createAdminSchema),
      },
    },
    createAdminHandler
  );

  app.post("/admin/logout", async (req, reply) => {
    reply.clearCookie("admin_token", {
      path: "/",
    });

    return reply.send({
      message: "Logout successful",
    });
  });
}
