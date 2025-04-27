"use client";

import { createSubjectAction } from "@/actions/createSubjectAction";
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
      <div>
        <label htmlFor="name">Název předmětu</label>
        <input id="name" name="name" type="text" placeholder="Český jazyk 1" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}
      <button type="submit">
        {pending ? "Přidávání předmětu..." : "Přidat předmět"}
      </button>
    </form>
  );
}
