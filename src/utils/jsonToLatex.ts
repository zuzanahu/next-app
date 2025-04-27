/* eslint-disable @typescript-eslint/no-explicit-any */

export const jsonToLatex = (json: any): string => {
  if (!json || !json.content) return "";

  let latex = "";
  json.content.forEach((node: any) => {
    latex += processNode(node);
  });

  return latex;
};

const processNode = (node: any): string => {
  switch (node.type) {
    case "paragraph":
      return node.content ? `${processInlineNodes(node.content)}\n\n` : "";
    case "text":
      return node.marks ? applyMarks(node.text, node.marks) : node.text;
    case "bold":
      return `\\textbf{${node.text}}`;
    case "italic":
      return `\\textit{${node.text}}`;
    case "bulletList":
      return (
        "\\begin{itemize}\n" +
        node.content.map(processNode).join("\n") +
        "\\end{itemize}\n"
      );
    case "listItem":
      return `  \\item ${processInlineNodes(node.content)}`;
    case "codeBlock":
      return `\\begin{verbatim}\n${node.content[0].text}\n\\end{verbatim}\n`;
    case "image":
      return `\\begin{figure}[h]
  \\centering
  \\includegraphics[width=0.8\\textwidth]{${node.attrs.src}}
  \\caption{${node.attrs.alt || "Image"}}
\\end{figure}\n`;
    case "math_inline":
    case "math_display":
      return `\\[${node.content[0].text}\\]\n`;
    case "table":
      return processTable(node);
    case "heading":
      switch (node.attrs.level) {
        case 1:
      }
    default:
      console.warn(`Unhandled node type: ${node.type}`);
      return "";
  }
};

const processInlineNodes = (content: any): string => {
  return content.map(processInlineNode).join("");
};

const processInlineNode = (node: any): string => {
  switch (node.type) {
    case "text":
      return node.marks ? applyMarks(node.text, node.marks) : node.text;
    case "bold":
      return `\\textbf{${node.text}}`;
    case "italic":
      return `\\textit{${node.text}}`;
    default:
      return "";
  }
};

const applyMarks = (text: string, marks: any[]): string => {
  marks.forEach((mark) => {
    if (mark.type === "bold") text = `\\textbf{${text}}`;
    if (mark.type === "italic") text = `\\textit{${text}}`;
  });
  return text;
};

const processTable = (node: any): string => {
  if (!node.content || node.content.length === 0) return "";

  // Determine how many columns you have
  const numColumns = node.content[0].content.length;
  // Create a repeated pattern of |X| for each column
  const columnsSpec = `|${"X|".repeat(numColumns)}`;

  let latexTable = `\\begin{table}[H]
  \\centering
  \\begin{tabularx}{\\textwidth}{${columnsSpec}}
  \\hline`;

  node.content.forEach((row: any) => {
    latexTable +=
      row.content.map(processTableCell).join(" & ") + " \\\\\n  \\hline\n";
  });

  latexTable += `\\end{tabularx}
  \\caption{Your Table Caption}
  \\end{table}\n`;

  return latexTable;
};

const processTableCell = (cell: any): string => {
  // This flattens the paragraphs and ignores line breaks
  const flatContent =
    cell.content
      ?.map((block: any) => processInlineNodes(block.content || []))
      .join(" ") || "";
  const colspan = cell.attrs?.colspan || 1;
  const rowspan = cell.attrs?.rowspan || 1;

  let latexCell = flatContent;

  // Bold the cell text if it's a header cell
  if (cell.type === "tableHeader") {
    latexCell = `\\textbf{${latexCell}}`;
  }

  // Apply column spanning if needed
  if (colspan > 1) {
    latexCell = `\\multicolumn{${colspan}}{|c|}{${latexCell}}`;
  }

  // Apply row spanning if needed
  if (rowspan > 1) {
    latexCell = `\\multirow{${rowspan}}{*}{${latexCell}}`;
  }

  return latexCell;
};
