"use client";

import { useActionState } from "react";
import { createSubject } from "../utils/createSubject";

export function CreateSubjectForm() {
  const [state, action, pending] = useActionState(createSubject, undefined);

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
