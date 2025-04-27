"use server";

import { db } from "@/db";
import { subjectsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteSubject(subjectId: number) {
  await db.delete(subjectsTable).where(eq(subjectsTable.id, subjectId));
}
