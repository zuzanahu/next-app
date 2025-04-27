"use server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(userId: number) {
  await db.delete(usersTable).where(eq(usersTable.id, userId));
}
