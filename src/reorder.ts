import { exec } from "./exec";
import * as path from "path";
import fg from "fast-glob";
import { EXERCISE_NUMBER_LENGTH } from "./constants";

/**
 * Reorders all 01-*.problem.ts and 01-*.solution*.ts files in the directory
 */

const parsePath = (relativePath: string) => {
  const parsedPath = path.parse(relativePath);

  const dir = parsedPath.dir;

  const pathName = parsedPath.base;

  const isProblem = pathName.includes("problem");
  const isSolution = pathName.includes("solution");
  const isExplainer = pathName.includes("explainer");

  const isValid = isProblem || isSolution || isExplainer;
  return {
    isValid,
    dir,
    isExplainer,
    isProblem,
    hasDir: Boolean(dir),
    dirNum: dir.split("-")[0],
    num: pathName.split("-")[0],
  };
};

export const reorder = (basePath: string) => {
  const paths = fg.sync(path.join(basePath, "**/**.{ts,tsx}")).map((p) => {
    return path.relative(basePath, p);
  });

  const { changes } = getPathsToChange(paths);

  changes.forEach(({ from, to, newNum, prevNum }) => {
    console.log(`Renaming ${prevNum} to ${newNum}`);
    exec(`mv ${path.resolve(basePath, from)} ${path.resolve(basePath, to)}`);
  });
};

type ChangeInstruction = {
  from: string;
  to: string;
  prevNum: string;
  newNum: string;
};

export const getPathsToChange = (
  inputPaths: string[],
): {
  changes: ChangeInstruction[];
  newPaths: string[];
} => {
  const dirMap: Record<
    string,
    Record<
      string,
      {
        paths: string[];
      }
    >
  > = {};

  inputPaths.forEach((p) => {
    const { isValid, num, dir } = parsePath(p);

    if (!isValid) {
      return;
    }

    dirMap[dir] ??= {};
    dirMap[dir][num] ??= { paths: [] };

    dirMap[dir][num].paths.push(p);
  });

  const changes: ChangeInstruction[] = [];
  const newPaths: string[] = [];

  let index = 0;

  Object.entries(dirMap)
    .sort(([aDir], [bDir]) => {
      return aDir.localeCompare(bDir);
    })
    .forEach(([dir, exerciseMap]) => {
      const newExerciseOrder = Object.keys(exerciseMap).sort(
        (a, b) => parseFloat(a) - parseFloat(b),
      );

      newExerciseOrder.map((previousNum) => {
        index += 1;
        const newNumStr = String(index).padStart(EXERCISE_NUMBER_LENGTH, "0");

        const { paths } = exerciseMap[previousNum];

        paths.forEach((p) => {
          const { dir, base } = path.parse(p);
          const newName = base.split("-").slice(1).join("-");
          const newBase = `${newNumStr}-${newName}`;
          const newPath = path.join(dir, newBase);

          newPaths.push(newPath);

          if (base !== newBase) {
            changes.push({
              from: p,
              to: newPath,
              prevNum: previousNum,
              newNum: newNumStr,
            });
          }
        });
      });
    });

  return { changes, newPaths: newPaths.sort((a, b) => a.localeCompare(b)) };
};
