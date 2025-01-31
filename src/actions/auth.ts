"use server";

import { LoginFormSchema, LoginFormState } from "@/lib/definitions";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../../lib/session";

export async function login(state: LoginFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Find the user by email
  const user = await db.query.usersTable
    .findFirst({
      where: eq(usersTable.email, validatedFields.data.email),
    })
    .catch(() => {
      return console.log("such user doesn't exist");
    });

  if (user != undefined) {
    const password = user.password;

    if (password != validatedFields.data.password) {
      const errorMessage = "You have a wrong pasword or email";
      console.log(errorMessage);
    } else {
      createSession(user.id);
      redirect("/");
    }
  }
}

export async function logout() {
  deleteSession();
  redirect("/login");
}
