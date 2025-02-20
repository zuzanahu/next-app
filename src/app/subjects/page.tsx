import { db } from "@/db";
import { CreateDocumentButton } from "../../components/CreateDocumentButton";
import Link from "next/link";
import dayjs from "dayjs";
import clsx from "clsx";
import { DATE_FORMAT_NO_TIME } from "@/constans";
import { getLoggedInUserOrRedirect } from "@/utils/getLoggedInUserOrRedirect";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany({
    with: { documents: true },
  });
  const currentUser = await getLoggedInUserOrRedirect();

  return (
    <>
      <div className="container">
        <h1 className="mt-10 mb-5 text-2xl font-semibold">Předměty</h1>
      </div>
      <ul className="divide-y divide-gray-500 flex flex-col container gap-y-5">
        {subjects ? (
          subjects.map((subject) => {
            return (
              <li className="pb-5" key={subject.id}>
                <h2 className="text-lg">{subject.name}</h2>
                {currentUser.role?.canCreateDocuments ? (
                  <div className="mt-1 text-sm flex flex-wrap gap-3 **:text-blue-800 **:cursor-pointer **:underline **:hover:no-underline">
                    <CreateDocumentButton
                      subjectId={subject.id}
                      openAfterCreate
                      text="Vytvořit nový prázdný dokument a otevřít"
                      textCreating="Vytvářím prázdný dokument..."
                    />
                  </div>
                ) : null}
                <ul className="list-disc pl-5 mt-3">
                  {subject.documents.map((document) => (
                    <li key={document.id}>
                      <Link
                        className={clsx(
                          "hover:underline block",
                          document.isFinal && "text-green-600"
                        )}
                        href={`/subjects/${subject.id}/${document.id}`}
                      >
                        {document.title}
                      </Link>
                      <small>
                        ({dayjs(document.createdAt).format(DATE_FORMAT_NO_TIME)}
                        )
                      </small>
                    </li>
                  ))}
                </ul>
                {!subject.documents.length ? (
                  <div className="text-red-600 italic text-sm">
                    Zatím žádné dokumenty
                  </div>
                ) : null}
              </li>
            );
          })
        ) : (
          <small>There are no subjets yet</small>
        )}
      </ul>
    </>
  );
}
