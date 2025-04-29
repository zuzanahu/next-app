"use server";
import type { ChangeUserPasswordFormState } from "@/components/ChangeUserPasswordButton";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { changeUserPasswordFormSchema } from "@/schemas/changeUserPasswordFormSchema";
import { getLoggedInUser } from "@/utils/getLoggedInUser";
import { hashPassword } from "@/utils/hashPassword";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function changeUserPasswordAction(
  previouState: ChangeUserPasswordFormState | undefined,
  formData: FormData
) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser || !loggedInUser.role?.canViewAdministration) {
    throw new Error(
      "To change user you need to be logged in and administrator"
    );
  }

  if (loggedInUser.id === Number(formData.get("userId"))) {
    throw new Error("You cannot change password for yourself this way");
  }

  // Validate form fields
  const validatedFields = await changeUserPasswordFormSchema.safeParseAsync({
    userId: formData.get("userId"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await db
    .update(usersTable)
    .set({
      password: await hashPassword(validatedFields.data.password),
    })
    .where(eq(usersTable.id, validatedFields.data.userId));

  revalidatePath("/administrace/uzivatele");

  return { shouldClose: true };
}
