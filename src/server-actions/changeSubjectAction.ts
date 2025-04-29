"use server";
import type { ChangeSubjectFormState } from "@/components/ChangeSubjectForm";
import { db } from "@/db";
import { subjectsTable } from "@/db/schema";
import { changeSubjectFormSchema } from "@/schemas/changeSubjectFormSchema";
import { getLoggedInUser } from "@/utils/getLoggedInUser";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function changeSubjectAction(
  previouState: ChangeSubjectFormState | undefined,
  formData: FormData
) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser || !loggedInUser.role?.canViewAdministration) {
    throw new Error(
      "To change subjects you need to be logged in and administrator"
    );
  }

  const data = {
    name: formData.get("name"),
    subjectId: formData.get("subjectId"),
  };

  // Validate form fields
  const validatedFields = await changeSubjectFormSchema.safeParseAsync(data);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      inputData: data,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await db
    .update(subjectsTable)
    .set({
      name: validatedFields.data.name,
    })
    .where(eq(subjectsTable.id, validatedFields.data.subjectId));

  revalidatePath("/administrace/predmety");
  revalidatePath("/predmety");

  return {
    finishedAt: dayjs().toISOString(),
  };
}
