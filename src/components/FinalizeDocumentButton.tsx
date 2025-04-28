"use client";

import { useTransition } from "react";
import { finalizeDocument } from "../server-functions/finalizeDocument";

export function FinalizeDocumentButton({
  documentId,
  text,
  textWorking,
  disabled,
}: {
  documentId: number;
  text: string;
  textWorking: string;
  disabled?: boolean;
}) {
  const [isWorking, trackIsWorking] = useTransition();
  return (
    <button
      disabled={disabled ?? isWorking}
      className="px-4 py-1 bg-green-600 focus:ring-2 rounded-md text-sm text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => {
        trackIsWorking(async () => {
          await finalizeDocument(documentId);
        });
      }}
    >
      {isWorking ? textWorking : text}
    </button>
  );
}
