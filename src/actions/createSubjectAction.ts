"use server";
import type { CreateSubjectFormState } from "@/components/CreateSubjectForm";
import { db } from "@/db";
import { subjectsTable } from "@/db/schema";
import { createSubjectFormSchema } from "@/schemas/createSubjectFormSchema";

export async function createSubjectAction(
  previouState: CreateSubjectFormState | undefined,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = createSubjectFormSchema.safeParse({
    name: formData.get("name"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await db.insert(subjectsTable).values({
    name: validatedFields.data.name,
  });
}
