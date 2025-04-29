"use server";
import type { CreateUserFormState } from "@/components/CreateUserForm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { createUserFormSchema } from "@/schemas/createUserFormSchema";
import { hashPassword } from "@/utils/hashPassword";
import { revalidatePath } from "next/cache";

export async function createUserAction(
  previousState: CreateUserFormState | undefined,
  formData: FormData
) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    roleId: formData.get("roleId"),
  };

  // Validate form fields
  const validatedFields = await createUserFormSchema.safeParseAsync(data);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      inputData: data,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await db.insert(usersTable).values({
    name: validatedFields.data.name,
    email: validatedFields.data.email,
    password: await hashPassword(validatedFields.data.password),
    roleId: validatedFields.data.roleId,
  });

  // Refresh administration page, this helf with refreshing the clientside for user
  revalidatePath("/administrace/uzivatele");
}
