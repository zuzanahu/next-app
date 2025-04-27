"use client";

import { Accordion } from "@mantine/core";
import { CreateDocumentButton } from "./CreateDocumentButton";
import Link from "next/link";
import dayjs from "dayjs";
import clsx from "clsx";
import { DATE_FORMAT_NO_TIME } from "@/constans";

import type { Document, Subject } from "@/db/schema";

type SubjectWithDocuments = Subject & { documents: Document[] };

export function ListOfSubjects({
  subjects,
  canCreateDocuments,
}: {
  subjects: SubjectWithDocuments[];
  canCreateDocuments: boolean | null | undefined;
}) {
  return (
    <Accordion
      chevronPosition="right"
      variant="contained"
      className="container"
    >
      {subjects ? (
        subjects.map((subject) => {
          return (
            <Accordion.Item value={subject.name} key={subject.id}>
              <Accordion.Control>
                <h2 className="text-lg">{subject.name}</h2>
              </Accordion.Control>
              <Accordion.Panel>
                {canCreateDocuments ? (
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
                        href={`/predmety/${subject.id}/${document.id}`}
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
              </Accordion.Panel>
            </Accordion.Item>
          );
        })
      ) : (
        <small>There are no subjets yet</small>
      )}
    </Accordion>
  );
}
