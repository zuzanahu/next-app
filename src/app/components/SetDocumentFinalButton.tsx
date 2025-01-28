"use client";

import { startTransition } from "react";
import { createDocument } from "../utils/createDocument";
import { finalizeDocument } from "../utils/finalizeDocument";

export function SetDocumentFinalButton({ documentId }: { documentId: number }) {
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await finalizeDocument(documentId);
        });
      }}
    >
      Set document as final
    </button>
  );
}
