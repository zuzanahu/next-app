"use server";

import { db } from "@/db";
import { subjectsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteSubject(subjectId: number) {
  await db.delete(subjectsTable).where(eq(subjectsTable.id, subjectId));

  revalidatePath("/administrace/predmety");
  revalidatePath("/predmety");
}
