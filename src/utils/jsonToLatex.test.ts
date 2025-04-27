import { describe, expect, it } from "vitest";
import { jsonToLatex } from "./jsonToLatex";

describe("jsonToLatex", () => {
  it("converts json to latex correctly", () => {
    const result = jsonToLatex({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Vzdělávací obsah",
            },
          ],
        },
      ],
    });

    expect(result).toMatchSnapshot();
  });
});
