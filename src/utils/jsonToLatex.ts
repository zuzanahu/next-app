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

    default:
      console.warn(`Unhandled node type: ${node.type}`);
      return "";
  }
};

const processInlineNodes = (content: any): string => {
  return content.map((node: any) => processNode(node)).join("");
};

const applyMarks = (text: string, marks: any[]): string => {
  marks.forEach((mark) => {
    if (mark.type === "bold") text = `\\textbf{${text}}`;
    if (mark.type === "italic") text = `\\textit{${text}}`;
  });
  return text;
};
