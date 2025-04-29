"use client";

import type { Subject } from "@/db/schema";
import { useAutoResetState } from "@/hooks/useAutoResetState";
import { changeSubjectAction } from "@/server-actions/changeSubjectAction";
import { TextInput, Tooltip, type TextInputProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconCheck, IconLoader } from "@tabler/icons-react";
import { useActionState, useEffect, useRef } from "react";

export type ChangeSubjectFormState = {
  errors?: {
    name?: string[];
    subjectId?: string[];
  };
  name?: string;
  subjectId?: string;
  // This is changing value each time it is submitted. this is because of the useEffect that reacts to successful submits and shows message
  // If it would not change and would be the same (lets say true) each  time then useEffect will work only once
  finishedAt?: string;
};

export function ChangeSubjectForm({ subject }: { subject: Subject }) {
  const [showIsFinishedSaving, setShowIsFinishedSaving] = useAutoResetState({
    timeout: 2500,
    defaultValue: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    changeSubjectAction,
    undefined
  );

  // This can be called multiple times, however After 500ms delay it will execute
  const debouncedSave = useDebouncedCallback(() => {
    // Lets just submit the programatically here, no button is needed
    formRef.current?.requestSubmit();
  }, 500);

  const handleChange: TextInputProps["onChange"] = () => {
    debouncedSave();
  };

  useEffect(() => {
    if (state?.finishedAt) {
      setShowIsFinishedSaving(true);
    }
    // This has to be done this way othervise it will be almost always hidden. Just react to isSuccess
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.finishedAt]);

  return (
    <form action={action} ref={formRef} className="w-full">
      <input type="hidden" name="subjectId" value={subject.id} />
      <TextInput
        name="name"
        placeholder="Předmět"
        label="Název předmětu"
        className="w-full"
        onChange={handleChange}
        defaultValue={state?.inputData?.name?.toString() ?? subject.name}
        rightSection={
          pending ? (
            <Tooltip label="Ukládám">
              <IconLoader className="animate-spin" />
            </Tooltip>
          ) : showIsFinishedSaving ? (
            <Tooltip label="Uloženo!" className="text-green-600">
              <IconCheck />
            </Tooltip>
          ) : null
        }
      />
    </form>
  );
}
