"use client";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getAllFinalizedDocuments } from "@/utils/getAllFinalizedDocuments";

export function FinalizedDocuments() {
  const [missingSubjects, setMissingSubjects] = useState<string[]>([]);
  const [missingContentSubjects, setMissingContentSubjects] = useState<
    string[]
  >([]);
  const [opened, { open, close }] = useDisclosure(false);

  const handleClick = async () => {
    const { missingDocuments, missingContentDocuments, finalizedDocuments } =
      await getAllFinalizedDocuments();

    setMissingSubjects(missingDocuments);
    setMissingContentSubjects(missingContentDocuments);

    if (missingDocuments.length > 0 || missingContentDocuments.length > 0) {
      open(); // Show modal if issues exist
    } else {
      generateAndDownloadLatex(finalizedDocuments);
    }
  };

  const generateAndDownloadLatex = (
    documents: { subject: string; content: string }[]
  ) => {
    let latexContent = `
      \\documentclass{article}
      \\usepackage{graphicx}
      \\begin{document}
    `;

    documents.forEach(({ subject, content }) => {
      latexContent += `
        \\section*{${subject}}
        ${content.replace(/\n/g, "\n\n")} % Proper formatting
      `;
    });

    latexContent += "\\end{document}";

    const blob = new Blob([latexContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finalized_documents.tex";
    link.click();
  };

  return (
    <>
      <button onClick={handleClick}>
        Získat všechny finalizované dokumenty
      </button>
      <Modal
        opened={opened}
        onClose={close}
        title="Vyskytla se chyba."
        centered
      >
        {missingSubjects.length > 0 && (
          <>
            <p className="mb-5 text-red-500">
              Některé předměty nemají finalizovaný dokument:
            </p>
            <ul>
              {missingSubjects.map((subject) => (
                <li key={subject} className="list-disc ml-4">
                  Předmět "{subject}" nemá finalizovaný dokument.
                </li>
              ))}
            </ul>
          </>
        )}
        {missingContentSubjects.length > 0 && (
          <>
            <p className="mt-5 mb-5 text-orange-500">
              Některé finalizované dokumenty neobsahují žádný obsah:
            </p>
            <ul>
              {missingContentSubjects.map((subject) => (
                <li key={subject} className="list-disc ml-4">
                  Předmět "{subject}" má finalizovaný dokument, ale neobsahuje
                  žádný obsah.
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </>
  );
}
