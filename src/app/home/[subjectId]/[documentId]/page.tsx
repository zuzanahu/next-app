import Editor from "@/app/components/Editor";
import { SetDocumentFinalButton } from "@/app/components/SetDocumentFinalButton";
import { db } from "@/db";
import { documentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: number }>;
}) {
  // fetch content from db
  const documentId = (await params).documentId;
  const document = await db.query.documentsTable.findFirst({
    where: (documentsTable, { eq }) => eq(documentsTable.id, documentId ?? ""),
  });
  const content = document?.content ?? "";

  async function handleSave(content: string) {
    "use server";
    await db
      .update(documentsTable)
      .set({ content: content, revisedAt: new Date() })
      .where(eq(documentsTable.id, documentId));
  }

  return (
    <>
      <h1>My Page {(await params).documentId} hsshs</h1>
      <Editor initialContent={content} handleSave={handleSave}></Editor>
      <SetDocumentFinalButton documentId={documentId}></SetDocumentFinalButton>
    </>
  );
}
