"use client";

import { Accordion, Tooltip } from "@mantine/core";
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
                <div className="flex gap-2 items-center">
                  <h2 className="text-lg">{subject.name}</h2>
                  {subject.documents.map((document) => {
                    if (document.isFinal === true) {
                      return (
                        <Tooltip
                          key={document.id}
                          label="Má dokument s finální verzí"
                          withArrow
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 fill-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Tooltip>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                {canCreateDocuments ? (
                  <CreateDocumentButton
                    subjectId={subject.id}
                    openAfterCreate
                    text="Nový dokument"
                    textCreating="Vytvářím prázdný dokument..."
                  />
                ) : null}
                <ul className="list-disc pl-5 mt-3">
                  {subject.documents.map((document) => (
                    <li key={document.id}>
                      <div className="flex gap-2">
                        <Link
                          className={clsx(
                            "hover:underline block",
                            document.isFinal && "text-green-600"
                          )}
                          href={`/predmety/${subject.id}/${document.id}`}
                        >
                          {document.title}
                        </Link>
                        <Tooltip label="Duplikovat dokument" withArrow>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                            />
                          </svg>
                        </Tooltip>
                      </div>

                      <small>
                        Datum vytvoření:{" "}
                        {dayjs(document.createdAt).format(DATE_FORMAT_NO_TIME)}
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
