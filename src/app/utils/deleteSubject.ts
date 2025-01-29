"use server";
import { db } from "@/db";
import { documentsTable, subjectsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function deleteSubject(subjectId: number) {
  await db.delete(subjectsTable).where(eq(subjectsTable.id, subjectId));
}
