"use client";

import { useTransition } from "react";
import { deleteUser } from "../server-functions/deleteUser";
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

export function DeleteUserButton({ userId }: { userId: number }) {
  const [pending, trackTransition] = useTransition();

  return (
    <ActionIcon
      loading={pending}
      variant="subtle"
      color="red"
      onClick={() => {
        if (confirm("Opravdu smazat uživatele?")) {
          trackTransition(async () => {
            await deleteUser(userId);
          });
        }
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
}
