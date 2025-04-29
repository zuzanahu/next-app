"use client";

import { createSubjectAction } from "@/server-actions/createSubjectAction";
import { Button, TextInput } from "@mantine/core";
import { useActionState } from "react";

export type CreateSubjectFormState = {
  errors?: {
    name?: string[];
  };
  message?: string;
};

export function CreateSubjectForm() {
  const [state, action, pending] = useActionState(
    createSubjectAction,
    undefined
  );

  return (
    <form action={action}>
      <TextInput
        name="name"
        label="Název předmětu"
        placeholder="Český jazyk 1"
        error={state?.errors?.name}
      />
      <Button type="submit" size="xs" mt="xs" loading={pending}>
        {pending ? "Přidávání předmětu..." : "Přidat předmět"}
      </Button>
    </form>
  );
}
