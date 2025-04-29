"use server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: number) {
  await db.delete(usersTable).where(eq(usersTable.id, userId));
  revalidatePath("/administrace/uzivatele");
}
