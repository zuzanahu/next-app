"use client";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getAllFinalizedDocuments } from "@/server-functions/getAllFinalizedDocuments";
import { jsonToLatex } from "@/utils/jsonToLatex";

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
    // float so that the table stays at the place, that i have defined it at
    let latexContent = `
      \\documentclass{article}
      \\usepackage{graphicx}
      \\usepackage{amsmath} % For math equations
      \\usepackage{tabularx}
      \\usepackage{multirow}
      \\usepackage{float}
      \\begin{document}
    `;

    documents.forEach(({ subject, content }) => {
      let formattedContent = "";

      try {
        const parsedContent = JSON.parse(content);
        formattedContent = jsonToLatex(parsedContent);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        formattedContent = "\\textbf{Error: Could not parse document.}";
      }

      latexContent += `
        \\section*{${subject}}
        ${formattedContent}
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
        Získat všechny dokumenty s finální verzí
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
              Některé předměty nemají dokument s finální verzí:
            </p>
            <ul>
              {missingSubjects.map((subject) => (
                <li key={subject} className="list-disc ml-4">
                  `Předmět ${subject} nemá dokument s finální verzí.`
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
                  `Předmět ${subject} má finalizovaný dokument, ale neobsahuje
                  žádný obsah.`
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </>
  );
}
