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
    case "underline":
      return `\\underline{${node.text}}`;
    case "bulletList":
      return (
        "\\begin{itemize}\n" +
        node.content.map(processNode).join("\n") +
        "\\end{itemize}\n"
      );
    case "listItem":
      return `\\item ${processInlineNodes(node.content)}`;

    case "table":
      return processTable(node);
    case "heading":
      const { level } = node.attrs;
      switch (level) {
        case 2:
          return `\\subsection{${processInlineNodes(node.content)}}\n\n`;
        case 3:
          return `\\subsubsection{${processInlineNodes(node.content)}}\n\n`;
        default:
          return `Invalid Heading "${processInlineNodes(node.content)}"`;
      }
    default:
      console.warn(`Unhandled node type: ${node.type}`);
      return "";
  }
};

const processInlineNodes = (content: any): string => {
  return content
    .map((node: any) => {
      if (node.type === "paragraph")
        return processInlineNodes(node.content || []);
      return processInlineNode(node);
    })
    .join("");
};

const processInlineNode = (node: any): string => {
  switch (node.type) {
    case "text":
      return node.marks ? applyMarks(node.text, node.marks) : node.text;
    case "bold":
      return `\\textbf{${node.text}}`;
    case "italic":
      return `\\textit{${node.text}}`;
    case "underline":
      return `\\underline{${node.text}}`;
    default:
      return "";
  }
};

const applyMarks = (text: string, marks: any[]): string => {
  marks.forEach((mark) => {
    if (mark.type === "bold") text = `\\textbf{${text}}`;
    if (mark.type === "italic") text = `\\textit{${text}}`;
    if (mark.type === "underline") text = `\\underline{${text}}`;
  });
  return text;
};

const processTable = (node: any): string => {
  if (!node.content || node.content.length === 0) return "";

  let maxColumns = 0;
  node.content.forEach((row: any) => {
    let colCount = 0;
    row.content.forEach((cell: any) => {
      colCount += cell.attrs?.colspan || 1;
    });
    maxColumns = Math.max(maxColumns, colCount);
  });

  const columnsSpec = `|${"X|".repeat(maxColumns)}`;
  const rowSpans: number[] = new Array(maxColumns).fill(0);

  let latexTable = `\\begin{table}[H]\n\\centering\n\\begin{tabularx}{\\textwidth}{${columnsSpec}}\n\\hline\n`;

  node.content.forEach((row: any, rowIndex: number) => {
    const rowLatex = processTableRow(row, rowSpans, maxColumns);
    latexTable += rowLatex;

    // Check if it's the last row
    const isLastRow = rowIndex === node.content.length - 1;

    if (!isLastRow) {
      const clines = [];
      let inRange = false;
      let rangeStart = 0;

      for (let i = 0; i < maxColumns; i++) {
        if (rowSpans[i] === 0) {
          if (!inRange) {
            rangeStart = i + 1;
            inRange = true;
          }
        } else {
          if (inRange) {
            clines.push([rangeStart, i]);
            inRange = false;
          }
        }
      }
      if (inRange) {
        clines.push([rangeStart, maxColumns]);
      }

      if (clines.length > 0) {
        clines.forEach(([start, end]) => {
          latexTable += `\\cline{${start}-${end}}\n`;
        });
      } else {
        latexTable += "\\hline\n";
      }
    } else {
      latexTable += "\\hline\n";
    }
  });

  latexTable += `\\end{tabularx}\n\\caption{Your Table Caption}\n\\end{table}\n`;
  return latexTable;
};

const processTableRow = (
  row: any,
  rowSpans: number[],
  maxColumns: number
): string => {
  const cells = [];
  let colIdx = 0;
  const rowCells = [...row.content]; // copy to avoid mutating original

  while (colIdx < maxColumns) {
    if (rowSpans[colIdx] > 0) {
      cells.push(""); // Placeholder for multirow continuation
      rowSpans[colIdx]--;
      colIdx++;
      continue;
    }

    const cell = rowCells.shift();
    if (!cell) {
      cells.push(""); // Empty cell
      colIdx++;
      continue;
    }

    const colspan = cell.attrs?.colspan || 1;
    const rowspan = cell.attrs?.rowspan || 1;
    for (let i = 0; i < colspan; i++) {
      if (rowspan > 1) rowSpans[colIdx + i] = rowspan - 1;
    }

    const baseContent = processTableCellContent(cell);
    let cellLatex = baseContent;

    if (colspan > 1 && rowspan > 1) {
      cellLatex = `\\multirow{${rowspan}}{*}{\\multicolumn{${colspan}}{|c|}{${baseContent}}}`;
    } else if (colspan > 1) {
      cellLatex = `\\multicolumn{${colspan}}{|c|}{${baseContent}}`;
    } else if (rowspan > 1) {
      cellLatex = `\\multirow{${rowspan}}{*}{${baseContent}}`;
    }

    cells.push(cellLatex);
    colIdx += colspan;
  }

  return cells.join(" & ") + " \\\\\n";
};

const processTableCellContent = (cell: any): string => {
  const content =
    cell.content
      ?.map((block: any) => processInlineNodes(block.content || []))
      .join(" ") || "";
  return cell.type === "tableHeader" ? `\\textbf{${content}}` : content;
};
