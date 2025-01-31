"use client";

import { startTransition } from "react";
import { createDocument } from "../utils/createDocument";

export function CreateDocumentButton({
  subjectId,
}: {
  subjectId: number;
}) {
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await createDocument(subjectId);
        });
      }}
    >
      Create new document
    </button>
  );
}
