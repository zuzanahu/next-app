import { z } from "zod";
import { createUserFormSchema } from "./createUserFormSchema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";

export const changeUserRoleFormSchema = createUserFormSchema
  .pick({
    roleId: true,
  })
  .extend({
    userId: z.coerce.number().refine(async (id) => {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
      });

      return !!user;
    }, "Uživatel neexistuje"),
  });
