"use server";
import { db } from "@/db";
import { documentsTable, type Subject } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const getAllFinalizedDocuments = async () => {
  const subjects = await db.query.subjectsTable.findMany();
  const missingDocuments: string[] = [];
  const missingContentDocuments: string[] = [];
  const finalizedDocuments: { subject: string; content: string }[] = [];

  for (const subject of subjects) {
    const finalizedDocument = await getFinalizedDocument(subject);

    if (!finalizedDocument) {
      missingDocuments.push(subject.name);
    } else if (!finalizedDocument.content) {
      missingContentDocuments.push(subject.name);
    } else {
      finalizedDocuments.push({
        subject: subject.name,
        content: finalizedDocument.content, // Store valid content
      });
    }
  }

  return {
    missingDocuments,
    missingContentDocuments,
    finalizedDocuments,
  };
};

const getFinalizedDocument = async (subject: Subject) => {
  return await db.query.documentsTable.findFirst({
    where: and(
      eq(documentsTable.subjectId, subject.id),
      eq(documentsTable.isFinal, true)
    ),
    columns: {
      content: true, // Fetch only necessary columns
    },
  });
};
