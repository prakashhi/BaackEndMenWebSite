// src/modules/user/user.controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../config/db";
import { users } from "./user.schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  mobile_no: string;
  password: string;
}

export const userLoginHandler = async (
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length == 0) {
      return reply.status(400).send({ message: "Invalid email or password" });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return reply.status(400).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user[0].id, role: "User" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    reply.setCookie("User_token", token, {
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
    console.error(err);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const userRegisterHandler = async (
  req: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) => {
  try {
    const { name, email, password, mobile_no } = req.body;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return reply.status(400).send({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds

    // Insert new user
    const insertedUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        mobile_no,
      })
      .returning();

    return reply.status(201).send({
      message: "User created successfully",
      user: {
        id: insertedUser[0].id,
        name: insertedUser[0].name,
        email: insertedUser[0].email,
        mobile_no: insertedUser[0].mobile_no,
      },
    });
  } catch (err: any) {
    console.error(err);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const userLogoutHandler = async (req, reply) => {
  try {
    reply.clearCookie("User_token", {
      path: "/",
    });

    return reply.send({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    return reply.status(500).send({
      error: "Logout failed",
    });
  }
};

export const userGetProfileData = async (req, reply) => {
  const userId = req.user.id;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Remove password before sending
  const { password, ...safeUser } = user[0];

  return reply.send({
    success: true,
    user:safeUser,
  });
};
