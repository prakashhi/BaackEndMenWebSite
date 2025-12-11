import { z } from "zod";

export const createAdminSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6), 
  }),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>["body"];
