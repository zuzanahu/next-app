"use server";
import type { CreateUserFormState } from "@/components/CreateUserForm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { createUserFormSchema } from "@/schemas/createUserFormSchema";

export async function createUserAction(
  previousState: CreateUserFormState | undefined,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = createUserFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await db.insert(usersTable).values({
    name: validatedFields.data.name,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });
}
