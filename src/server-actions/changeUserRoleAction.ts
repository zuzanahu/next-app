"use server";
import type { ChangeUserPasswordFormState } from "@/components/ChangeUserPasswordButton";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { changeUserRoleFormSchema } from "@/schemas/changeUserRoleFormSchema";
import { getLoggedInUser } from "@/utils/getLoggedInUser";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function changeUserRoleAction(
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
    throw new Error("You cannot change role for yourself this way");
  }

  // Validate form fields
  const validatedFields = await changeUserRoleFormSchema.safeParseAsync({
    userId: formData.get("userId"),
    roleId: formData.get("roleId"),
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
      roleId: validatedFields.data.roleId,
    })
    .where(eq(usersTable.id, validatedFields.data.userId));

  revalidatePath("/administrace/uzivatele");

  return { shouldClose: true };
}
