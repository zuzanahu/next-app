import { db } from "@/db";
import { subjectsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const createSubjectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Vyplňte prosím")
    .refine(async (input) => {
      const existingSubject = await db.query.subjectsTable.findFirst({
        where: eq(subjectsTable.name, input),
      });

      return !existingSubject;
    }, "Tento předmět již existuje"),
});
