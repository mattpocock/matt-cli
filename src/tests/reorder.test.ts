import { describe, it, expect } from "vitest";
import { getPathsToChange } from "../reorder";

describe("getPathsToChange", () => {
  it("REPL", () => {
    const paths = [
      "./01-notes/02-bar.explainer.ts",
      "./02-notes/01.5-whatever.problem.ts",
      "./02-notes/03-whatever.problem.ts",
      "./02-notes/04-whatever.problem.ts",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toMatchInlineSnapshot(`
      [
        "01-notes/01-bar.explainer.ts",
        "02-notes/02-whatever.problem.ts",
        "02-notes/03-whatever.problem.ts",
        "02-notes/04-whatever.problem.ts",
      ]
    `);
  });

  it("Should organize by directory", () => {
    const paths = [
      "./01-notes/02-bar.explainer.ts",
      "./02-notes/01.5-whatever.problem.ts",
      "./02-notes/01.2-something-else.problem.ts",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toEqual([
      "01-notes/01-bar.explainer.ts",
      "02-notes/02-something-else.problem.ts",
      "02-notes/03-whatever.problem.ts",
    ]);
  });

  it("Should organize properly whatever the directory input order", () => {
    const paths = [
      "./02-notes/01.5-whatever.problem.ts",
      "./02-notes/01.2-something-else.problem.ts",
      "./01-notes/02-bar.explainer.ts",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toEqual([
      "01-notes/01-bar.explainer.ts",
      "02-notes/02-something-else.problem.ts",
      "02-notes/03-whatever.problem.ts",
    ]);
  });

  it("Should properly organize directories if there is NO directory", () => {
    const paths = [
      "01-bar.explainer.ts",
      "01.2-something-else.problem.ts",
      "02.2-whatever.problem.ts",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toEqual([
      "01-bar.explainer.ts",
      "02-something-else.problem.ts",
      "03-whatever.problem.ts",
    ]);
  });
});
