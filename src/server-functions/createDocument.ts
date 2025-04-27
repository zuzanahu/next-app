"use server";

import { db } from "@/db";
import { documentsTable, sessionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createDocument(
  subjectId: number,
  redirectUser?: boolean
) {
  const userId = await getLoggedInUserId();

  const [{ id: newDocumentId }] = await db.transaction(async (ctx) => {
    const createdResult = await ctx
      .insert(documentsTable)
      .values({
        isFinal: false,
        ownerId: userId,
        revisedAt: new Date(),
        subjectId: subjectId,
        title: "",
      })
      .$returningId();

    await ctx
      .update(documentsTable)
      .set({ title: `Nový prázdný dokument (${createdResult[0].id})` });

    return createdResult;
  });

  const document = await db.query.documentsTable.findFirst({
    where: eq(documentsTable.id, newDocumentId),
  });

  revalidatePath(`/predmety`);

  if (redirectUser) {
    throw redirect(`/predmety/${document?.subjectId}/${document?.id}`);
  }
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
