import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../config/db";
import { admins } from "../admin/admin.schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { CreateAdminInput } from "../admin/SchemaType/adminSchema";


export const createAdminHandler = async (
  req: FastifyRequest<{ Body: CreateAdminInput }>,
  reply: FastifyReply
) => {
  const {  email, password } = req.body;

  // Check if admin already exists
  const existing = await db
  .select()
  .from(admins)
  .where(eq(admins.email, email))
  .limit(1);

  console.log(existing)

  if (existing.length > 0) {
    return reply.status(400).send({ msg: "Admin already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds

  // Insert admin
  await db.insert(admins).values({
    email,
    password: hashedPassword,
  });

  return reply.status(201).send({ msg: "Admin created successfully" });
};
