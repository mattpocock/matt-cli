import { describe, it, expect } from "vitest";
import { getPathsToChange } from "../reorder";

describe("getPathsToChange", () => {
  it("REPL", () => {
    const paths = [
      "./01-notes/002-bar.explainer",
      "./02-notes/001.5-whatever.problem",
      "./02-notes/003-whatever.problem",
      "./02-notes/004-whatever.problem",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toMatchInlineSnapshot(`
      [
        "01-notes/001-bar.explainer",
        "02-notes/002-whatever.problem",
        "02-notes/003-whatever.problem",
        "02-notes/004-whatever.problem",
      ]
    `);
  });

  it("Should organize by directory", () => {
    const paths = [
      "./01-notes/002-bar.explainer.ts",
      "./02-notes/001.5-whatever.problem.ts",
      "./02-notes/001.2-something-else.problem.ts",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toEqual([
      "01-notes/001-bar.explainer.ts",
      "02-notes/002-something-else.problem.ts",
      "02-notes/003-whatever.problem.ts",
    ]);
  });

  it("Should organize properly whatever the directory input order", () => {
    const paths = [
      "./02-notes/001.5-whatever.problem.ts",
      "./02-notes/001.2-something-else.problem.ts",
      "./01-notes/002-bar.explainer.ts",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toEqual([
      "01-notes/001-bar.explainer.ts",
      "02-notes/002-something-else.problem.ts",
      "02-notes/003-whatever.problem.ts",
    ]);
  });

  it("Should properly organize if there is NO directory", () => {
    const paths = [
      "001-bar.explainer.ts",
      "001.2-something-else.problem.ts",
      "002.2-whatever.problem.ts",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toEqual([
      "001-bar.explainer.ts",
      "002-something-else.problem.ts",
      "003-whatever.problem.ts",
    ]);
  });

  it("Should properly organize directories", () => {
    const paths = [
      "001-bar.explainer",
      "001.2-something-else.problem",
      "002.2-whatever.problem",
    ];

    const { newPaths } = getPathsToChange(paths);

    expect(newPaths).toEqual([
      "001-bar.explainer",
      "002-something-else.problem",
      "003-whatever.problem",
    ]);
  });
});
