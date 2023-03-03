import { exec } from "./exec";
import * as path from "path";
import fg from "fast-glob";

/**
 * Reorders all 01-*.problem.ts and 01-*.solution*.ts files in the directory
 */

const parsePath = (p: string) => {
  const pathBase = path.parse(p).base;

  const isProblem = pathBase.includes("problem");
  const isSolution = pathBase.includes("solution");

  const isValid = isProblem || isSolution;
  return {
    isValid,
    isProblem,
    num: pathBase.split("-")[0],
  };
};

export const reorder = (filePath: string) => {
  const currentMap: Record<
    string,
    {
      paths: string[];
    }
  > = {};

  fg.sync(path.join(filePath, "**/**.{ts,tsx}")).forEach((p) => {
    const { isValid, isProblem, num } = parsePath(p);

    if (!isValid) {
      return;
    }

    if (!currentMap[num]) {
      currentMap[num] = {
        paths: [],
      };
    }

    currentMap[num].paths.push(p);
  });

  const newOrder = Object.keys(currentMap).sort(
    (a, b) => parseFloat(a) - parseFloat(b),
  );

  newOrder.map((previousNum, index) => {
    const newNum = index + 1;
    const newNumStr = String(newNum).padStart(2, "0");

    const { paths } = currentMap[previousNum];

    paths.forEach((p) => {
      const { dir, base } = path.parse(p);
      const newName = base.split("-").slice(1).join("-");
      const newBase = `${newNumStr}-${newName}`;
      const newPath = path.join(dir, newBase);

      if (base !== newBase) {
        console.log(`Renaming ${previousNum} to ${newNumStr}`);
        exec(`mv ${p} ${newPath}`);
      }
    });
  });
};
