"use server";
import { db } from "@/db";
import { documentsTable, sessionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createDocument(subjectId: number) {
  const userId = await getLoggedInUserId();

  await db.insert(documentsTable).values({
    isFinal: false,
    ownerId: userId,
    revisedAt: new Date(),
    subjectId: subjectId,
  });

  revalidatePath(`/subjects`);
}

/**
 *
 * @returns user ID
 */
async function getLoggedInUserId() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  const session = await db.query.sessionsTable.findFirst({
    where: eq(sessionsTable.id, sessionId ?? ""),
  });
  if (!session) {
    redirect("/login");
  } else {
    return session.userId;
  }
}
