"use client";

import { useTransition } from "react";
import { deleteSubject } from "../server-functions/deleteSubject";
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

export function DeleteSubjectButton({
  subjectId,
  className,
}: {
  subjectId: number;
  className?: string;
}) {
  const [pending, trackTransition] = useTransition();

  return (
    <ActionIcon
      className={className}
      loading={pending}
      variant="subtle"
      color="red"
      size="lg"
      onClick={() => {
        if (confirm("Opravdu smazat předmět a s ním všechny jeho dokumenty?")) {
          trackTransition(async () => {
            await deleteSubject(subjectId);
          });
        }
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
}
