"use client";
import Underline from "@tiptap/extension-underline";
import { Editor as TiptapEditor, useEditor } from "@tiptap/react";
import { ListItem } from "@tiptap/extension-list-item";
import { RichTextEditor } from "@mantine/tiptap";
import { useTransition } from "react";
import { Heading } from "@tiptap/extension-heading";
import { Table as TiptapTable } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import clsx from "clsx";
import { Tooltip } from "@mantine/core";
import { Text } from "@tiptap/extension-text";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Italic } from "@tiptap/extension-italic";
import { Bold } from "@tiptap/extension-bold";
import { Document } from "@tiptap/extension-document";
import { BulletList } from "@tiptap/extension-bullet-list";

import {
  IconTable,
  IconTrash,
  IconRowInsertTop,
  IconRowInsertBottom,
  IconColumnInsertLeft,
  IconColumnInsertRight,
  IconRowRemove,
  IconColumnRemove,
  IconLayersDifference,
  IconLayersSubtract,
  IconLayoutGrid,
  IconLayoutColumns,
} from "@tabler/icons-react";
import { useAutoResetState } from "@/hooks/useAutoResetState";
import { useDebouncedCallback } from "@mantine/hooks";

type EditorProps = {
  initialContent: string;
  handleSave: (content: string) => Promise<void>;
};

export default function Editor({ initialContent, handleSave }: EditorProps) {
  const [showIsFinishedSaving, setShowIsFinishedSaving] = useAutoResetState({
    timeout: 1000,
    defaultValue: false,
  });
  // Use transition to have a way to tell user that there is a save going on
  const [isUpdating, startUpdatingTransition] = useTransition();

  // This can be called multiple times, however After 2000ms delay it will execute
  const debouncedSave = useDebouncedCallback((valueToBeSaved: string) => {
    // Call save server function with transition (so that we can tell user about it)
    startUpdatingTransition(async () => {
      await handleSave(valueToBeSaved);
      setShowIsFinishedSaving(true);
    });
  }, 2000);

  const editor = useEditor({
    extensions: [
      Heading.configure({
        levels: [2, 3],
      }),
      Text,
      Paragraph,
      BulletList,
      ListItem,
      Underline,
      Bold,
      Italic,
      Document,
      TiptapTable.configure({
        resizable: false,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
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
      <RichTextEditor
        classNames={{
          content: clsx(
            "[&_table]:border-1 [&_table]:border-black",
            "[&_table_td,th]:border-1 [&_table_td,th]:!border-black",
            "[&_table_td.selectedCell,th.selectedCell]:after:content-[''] [&_table_td.selectedCell,th.selectedCell]:after:absolute [&_table_td.selectedCell,th.selectedCell]:after:inset-0 [&_table_td.selectedCell,th.selectedCell]:after:bg-gray-400 [&_table_td.selectedCell,th.selectedCell]:after:opacity-30 [&_table_td.selectedCell,th.selectedCell]:after:pointer-events-none [&_table_td.selectedCell,th.selectedCell]:after:z-10 [&_table_td,th]:relative"
          ),
        }}
        editor={editor}
        variant="subtle"
      >
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <Tooltip label="H2" withArrow>
              <RichTextEditor.H2 />
            </Tooltip>
            <Tooltip label="H2" withArrow>
              <RichTextEditor.H3 />
            </Tooltip>
            <Tooltip label="Tučně" withArrow>
              <RichTextEditor.Bold />
            </Tooltip>
            <Tooltip label="Kurzíva" withArrow>
              <RichTextEditor.Italic />
            </Tooltip>
            <Tooltip label="Podtržení" withArrow>
              <RichTextEditor.Underline />
            </Tooltip>
            <Tooltip label="Vymazat formátování" withArrow>
              <RichTextEditor.ClearFormatting />
            </Tooltip>
            <TableMenu editor={editor}></TableMenu>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  );
}
const TableMenu = ({ editor }: { editor: TiptapEditor | null }) => {
  if (!editor) return null;

  return (
    <>
      <Tooltip label="Vložit tabulku" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
          }
        >
          <IconTable size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Smazat tabulku" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          <IconTrash size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Přidat řádek před" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          <IconRowInsertTop size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Přidat řádek za" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <IconRowInsertBottom size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Vymazat řádek" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <IconRowRemove size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Přidat sloupec před" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          <IconColumnInsertLeft size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Přidat sloupec za" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <IconColumnInsertRight size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Vymazat sloupec" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <IconColumnRemove size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Sloučit buňky" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().mergeCells().run()}
        >
          <IconLayersDifference size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Rozdělit buňky" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().splitCell().run()}
        >
          <IconLayersSubtract size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Přepnout hlavičku v prvním řádku" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        >
          <IconLayoutGrid size={18} />
        </RichTextEditor.Control>
      </Tooltip>

      <Tooltip label="Přepnout hlavičku v prvním sloupci" withArrow>
        <RichTextEditor.Control
          variant="default"
          onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        >
          <IconLayoutColumns size={18} />
        </RichTextEditor.Control>
      </Tooltip>
    </>
  );
};
