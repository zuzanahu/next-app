"use server";
import { db } from "@/db";
import { documentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function finalizeDocument(documentId: number) {
  //todo check if exists
  // firstly, find the subject that the document with documenIt belongs to
  const documentToFinalize = await db.query.documentsTable.findFirst({
    where: eq(documentsTable.id, documentId),
  });
  const subjectId = documentToFinalize?.subjectId;
  //set isFinal:false on a document in the same subject category as documentToFinalize, that has isFinal:true, so that only one document per subject has isFinal:true at a time
  if (subjectId) {
    const documentToReset = await db.query.documentsTable.findFirst({
      where: and(
        eq(documentsTable.isFinal, true),
        eq(documentsTable.subjectId, subjectId)
      ),
    });
    const documentToResetId = documentToReset?.id;
    if (documentToResetId) {
      await db
        .update(documentsTable)
        .set({ isFinal: false })
        .where(eq(documentsTable.id, documentToResetId));
    }
  }

  // set isFinal: true to the document, that this function was invoked on (document with documentId)
  await db
    .update(documentsTable)
    .set({ isFinal: true })
    .where(eq(documentsTable.id, documentId));
  revalidatePath(
    `/subjects/${documentToFinalize?.subjectId}/${documentToFinalize?.id}`
  );
}
