"use client";

import { useTransition } from "react";
import { createDocument } from "../server-functions/createDocument";
import { Button } from "@mantine/core";

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
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );

  return (
    <Button
      justify="center"
      leftSection={icon}
      variant="outline"
      color="indigo"
      onClick={() => {
        trackIsCreating(async () => {
          await createDocument(subjectId, openAfterCreate);
        });
      }}
    >
      {isCreating ? textCreating : text}
    </Button>
  );
}
