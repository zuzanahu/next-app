"use server";
import { db } from "@/db";
import {
  CreateSubjectFormSchema,
  CreateSubjectFormState,
} from "../lib/definitions";
import { subjectsTable } from "@/db/schema";

export async function createSubject(
  state: CreateSubjectFormState,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = CreateSubjectFormSchema.safeParse({
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
