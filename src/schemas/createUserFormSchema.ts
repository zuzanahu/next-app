import { db } from "@/db";
import { userRoles, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const createUserFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email." })
    .refine(async (input) => {
      const role = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, input),
      });

      return !role;
    }, "Uživatel pod tímto emailem již existuje"),
  roleId: z.coerce.number().refine(async (input) => {
    const role = await db.query.userRoles.findFirst({
      where: eq(userRoles.id, input),
    });

    return !!role;
  }, "Vybraná role neexistuje"),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});
