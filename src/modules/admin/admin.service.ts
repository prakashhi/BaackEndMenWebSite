import { db } from "../../config/db"; 
import { admins } from "./admin.schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function adminLoginService(email: string, password: string) {
  const admin = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

  if (admin.length === 0) {
    throw new Error("Admin not found");
  }

  const match = await bcrypt.compare(password, admin[0].password);
  if (!match) {
    throw new Error("Invalid password");
  }

  return admin[0];
}
