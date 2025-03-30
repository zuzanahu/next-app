"use client";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getAllFinalizedDocuments } from "@/utils/getAllFinalizedDocuments";

export function FinalizedDocuments() {
  const [missingSubjects, setMissingSubjects] = useState<string[]>([]);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <button
        onClick={async () => {
          setMissingSubjects(await getAllFinalizedDocuments());
          missingSubjects.length !== 0 ? open() : null;
        }}
      >
        Získat všechny finalizované dokumenty
      </button>
      <Modal
        opened={opened}
        onClose={close}
        title="Vyskytla se chyba."
        centered
      >
        <p className="mb-5 text-red-500">
          Každý předmět musí mít finalizovaný dokument.
        </p>
        <ul>
          {missingSubjects.map((subject) => (
            <li key={subject} className="list-disc ml-4">
              Předmět "{subject}" nemá finalizovaný dokument.
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
