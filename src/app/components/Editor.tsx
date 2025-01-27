"use client";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState, useTransition } from "react";

interface EditorProps {
  initialContent: string;
  handleSave: (content: string) => Promise<void>;
}

const useAutoResetState = <T extends any>(options: {
  timeout: number;
  defaultValue?: T;
}) => {
  const [current, setCurrent] = useState<T | undefined>(options.defaultValue);

  const handleSetCurrent: typeof setCurrent = (nextValueOrFunction) => {
    setCurrent(nextValueOrFunction);

    setTimeout(() => {
      setCurrent(undefined);
    }, options.timeout);
  };

  return [current, handleSetCurrent] as const;
};

export default function Editor({
  initialContent,
  handleSave: handleSave,
}: EditorProps) {
  const [showIsFinishedSaving, setShowIsFinishedSaving] = useAutoResetState({
    timeout: 1000,
    defaultValue: false,
  });

  // Use transition to have a way to tell user that there is a save going on
  const [isUpdating, startUpdatingTransition] = useTransition();
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  // This can be called multiple times, however After 400ms delay it will execute
  const debouncedSave = useDebounceCallback((valueToBeSaved: string) => {
    // Call save server function with transition (so that we can tell user about it)
    startUpdatingTransition(async () => {
      await handleSave(valueToBeSaved);
      setShowIsFinishedSaving(true);
    });
  }, 400);

  // This is called everytime user updates document (aka every keystroke)
  const handleChange = () => {
    debouncedSave(JSON.stringify(editor.document));
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div>
      {isUpdating
        ? "Autosave in progress..."
        : showIsFinishedSaving
        ? "Save done!"
        : null}
      <BlockNoteView editor={editor} onChange={handleChange} />
    </div>
  );
}
