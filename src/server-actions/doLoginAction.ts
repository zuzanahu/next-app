"use server";

import type { LoginFormState } from "@/app/login/page";
import { db } from "@/db";
import { type User, usersTable } from "@/db/schema";
import { loginFormSchema } from "@/schemas/loginFormSchema";
import { Messages } from "@/types/Messages";
import { isPasswordValid } from "@/utils/isPasswordValid";
import { createSession } from "@/utils/createSession";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function doLoginAction(
  previousState: LoginFormState | undefined,
  formData: FormData
) {
  let user: User | undefined;
  // Validate form fields
  const validatedFields = await loginFormSchema
    .superRefine(async (data, { addIssue }) => {
      user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, data.email),
      });

      if (
        !user ||
        !(await isPasswordValid({
          password: data.password,
          hashedPassword: user.password,
        }))
      ) {
        addIssue({
          path: ["email"],
          message: Messages.WRONG_CREDENTIALS,
          code: "custom",
        });
        addIssue({
          path: ["password"],
          message: Messages.WRONG_CREDENTIALS,
          code: "custom",
        });
      }
    })
    .safeParseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

  // If any form fields are invalid, return early
  if (!validatedFields.success || !user) {
    return {
      errors: validatedFields.error?.flatten().fieldErrors,
    };
  }

  await createSession({
    userId: user.id,
  });

  redirect("/predmety");
}
