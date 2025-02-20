"use client";

import { startTransition } from "react";
import { deleteSubject } from "../utils/deleteSubject";

export function DeleteSubjectButton({ subjectId }: { subjectId: number }) {
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await deleteSubject(subjectId);
        });
      }}
    >
      Smazat předmět a jeho dokumenty
    </button>
  );
}
