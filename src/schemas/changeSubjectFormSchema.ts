import { z } from "zod";
import { createSubjectFormSchema } from "./createSubjectFormSchema";
import { eq } from "drizzle-orm";
import { subjectsTable } from "@/db/schema";
import { db } from "@/db";

export const changeSubjectFormSchema = createSubjectFormSchema
  .pick({
    name: true,
  })
  .extend({
    subjectId: z.coerce.number().refine(async (id) => {
      const subject = await db.query.subjectsTable.findFirst({
        where: eq(subjectsTable.id, id),
      });

      return !!subject;
    }, "Předmět neexistuje"),
  });
