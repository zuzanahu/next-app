import Editor from "@/components/Editor";
import { FinalizeDocumentButton } from "@/components/FinalizeDocumentButton";
import { DATE_FORMAT_WITH_TIME } from "@/constans";
import { db } from "@/db";
import { documentsTable } from "@/db/schema";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ dokumentId: number }>;
}) {
  // fetch content from db
  const documentId = (await params).dokumentId;
  const document = await db.query.documentsTable.findFirst({
    where: (documentsTable, { eq }) => eq(documentsTable.id, documentId ?? ""),
    with: {
      owner: true,
    },
  });

  if (!document) {
    throw notFound();
  }
  const content = document?.content ?? "";
  // const ownerId = document?.ownerId;
  // get the user's name
  let name = "Neznámý uživatel";
  if (document.owner) {
    name = document.owner.name;
  }

  async function handleSave(content: string) {
    "use server";
    await db
      .update(documentsTable)
      .set({ content: content, revisedAt: new Date() })
      .where(eq(documentsTable.id, documentId));
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold my-5">{document.title}</h1>
      {/* Document information and actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-12">
        {/* Document information */}
        <section>
          <h2 className="text-sm font-semibold">Informace o dokumentu</h2>
          <ul className="list-disc pl-5 mt-2">
            <li>Vlastník: {name}</li>
            <li>
              Vytvořeno:{" "}
              {dayjs(document.createdAt).format(DATE_FORMAT_WITH_TIME)}
            </li>
            <li>
              Revize: {dayjs(document.revisedAt).format(DATE_FORMAT_WITH_TIME)}
            </li>
            <li>Finální verze: {document?.isFinal ? "Ano" : "Ne"}</li>
          </ul>
        </section>
        {/* Document actions */}
        <section>
          <h2 className="text-sm font-semibold">Nástroje</h2>
          <div className="flex flex-wrap gap-4 mt-2">
            <FinalizeDocumentButton
              documentId={documentId}
              text="Označit jako finální verzi"
              textWorking="Ukládám..."
              disabled={document.isFinal ? true : undefined}
            />
          </div>
        </section>
      </section>
      {/* Document content editor */}
      <Editor initialContent={content} handleSave={handleSave}></Editor>
    </div>
  );
}
