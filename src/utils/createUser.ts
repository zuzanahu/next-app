"use server";
import { db } from "@/db";
import { CreateUserFormSchema, CreateUserFormState } from "../lib/definitions";
import { usersTable } from "@/db/schema";

export async function createUser(
  state: CreateUserFormState,
  formData: FormData
) {
  // Validate form fields
  const validatedFields = CreateUserFormSchema.safeParse({
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
