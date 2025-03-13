"use server";

import { LoginFormSchema, LoginFormState } from "@/lib/definitions";
import { db } from "@/db";
import { User, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../lib/session";

export async function login(state: LoginFormState, formData: FormData) {
  let user: User | undefined;
  // Validate form fields
  const validatedFields = await LoginFormSchema.superRefine(
    async (data, { addIssue }) => {
      user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, data.email),
      });

      if (!user || user.password != data.password) {
        addIssue({
          path: ["email"],
          message: "Špatné přihlašovací údaje",
          code: "custom",
        });
        addIssue({
          path: ["password"],
          message: "Špatné přihlašovací údaje",
          code: "custom",
        });
      }
    }
  ).safeParseAsync({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success || !user) {
    return {
      errors: validatedFields.error?.flatten().fieldErrors,
    };
  }

  await createSession(user.id);

  redirect("/predmety");
}

export async function logout() {
  deleteSession();
  redirect("/login");
}
