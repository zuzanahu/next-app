import Editor from "@/app/components/Editor";
import { SetDocumentFinalButton } from "@/app/components/SetDocumentFinalButton";
import { db } from "@/db";
import { documentsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

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

  if (!document) {
    throw notFound();
  }
  const content = document?.content ?? "";
  const ownerId = document?.ownerId;
  // get the user's name
  let name = "Neznámý uživatel";
  if (ownerId) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, ownerId),
      columns: {
        name: true,
      },
    });
    name = user?.name ?? "Neznámý uživatel";
  }

  async function handleSave(content: string) {
    "use server";
    await db
      .update(documentsTable)
      .set({ content: content, revisedAt: new Date() })
      .where(eq(documentsTable.id, documentId));
  }
  const time = document?.createdAt.toLocaleTimeString();
  const date = document?.createdAt.toDateString();
  const datetime = (date ?? "Neznámý datum") + " " + (time ?? "");
  return (
    <>
      <h1>My Page {(await params).documentId} hsshs</h1>
      <section>
        <h2>Informace o dokumentu</h2>
        <ul>
          <li>Jméno vlastníka: {name}</li>
          <li>Datum vytvoření: {datetime}</li>
          <li>Datum revize: {datetime}</li>
          <li>Je dokument finalizovaný: {document?.isFinal ? "Ano" : "Ne"}</li>
        </ul>
      </section>

      <Editor initialContent={content} handleSave={handleSave}></Editor>
      {!document?.isFinal ? (
        <SetDocumentFinalButton
          documentId={documentId}
        ></SetDocumentFinalButton>
      ) : null}
    </>
  );
}
