"use server";
import { db } from "@/db";
import { documentsTable, Subject, subjectsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const getAllFinalizedDocuments = async () => {
  const subjects = await db.query.subjectsTable.findMany();
  const missingDocuments: string[] = [];

  for (const subject of subjects) {
    const finalizedDocument = await getFinalizedDocument(subject);
    if (!finalizedDocument) {
      missingDocuments.push(subject.name);
    }
  }

  return missingDocuments; // Return missing subjects to the client
};

const getFinalizedDocument = async (subject: Subject) => {
  const finalizedDocument = await db.query.documentsTable.findFirst({
    where: and(
      eq(documentsTable.subjectId, subject.id),
      eq(documentsTable.isFinal, true)
    ),
    //columns: {} todo: tady kdyžtak omitnout nějaké columns, které nebudu potřebovat
  });
  return finalizedDocument;
};
