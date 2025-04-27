"use client";

import { startTransition } from "react";
import { deleteUser } from "../server-functions/deleteUser";

export function DeleteUserButton({ userId }: { userId: number }) {
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await deleteUser(userId);
        });
      }}
    >
      Smazat uživatele
    </button>
  );
}
