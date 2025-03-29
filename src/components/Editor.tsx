"use client";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import { useState, useTransition } from "react";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";

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

export default function Editor({ initialContent, handleSave }: EditorProps) {
  const [showIsFinishedSaving, setShowIsFinishedSaving] = useAutoResetState({
    timeout: 1000,
    defaultValue: false,
  });
  // Use transition to have a way to tell user that there is a save going on
  const [isUpdating, startUpdatingTransition] = useTransition();

  // This can be called multiple times, however After 400ms delay it will execute
  const debouncedSave = useDebounceCallback((valueToBeSaved: string) => {
    // Call save server function with transition (so that we can tell user about it)
    startUpdatingTransition(async () => {
      await handleSave(valueToBeSaved);
      setShowIsFinishedSaving(true);
    });
  }, 400);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent ? JSON.parse(initialContent) : undefined,
    /**
     * This option gives us the control to enable the default behavior of rendering the editor immediately.
     */
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // This is called everytime user updates document (aka every keystroke)
      debouncedSave(JSON.stringify(editor?.getJSON()));
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <>
      {isUpdating
        ? "Autosave in progress..."
        : showIsFinishedSaving
        ? "Save done!"
        : null}
      <RichTextEditor editor={editor} variant="subtle">
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  );
}
