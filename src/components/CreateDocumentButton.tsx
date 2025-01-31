"use client";

import { PropsWithChildren, startTransition, useTransition } from "react";
import { createDocument } from "../utils/createDocument";

export function CreateDocumentButton({
  subjectId,
  openAfterCreate,
  text,
  textCreating,
}: {
  subjectId: number;
  openAfterCreate?: boolean;
  text: string;
  textCreating: string;
}) {
  const [isCreating, trackIsCreating] = useTransition();

  return (
    <button
      onClick={() => {
        trackIsCreating(async () => {
          await createDocument(subjectId, openAfterCreate);
        });
      }}
    >
      {isCreating ? textCreating : text}
    </button>
  );
}
