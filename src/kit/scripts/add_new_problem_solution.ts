import { readdir, writeFile } from "fs/promises";
import { arg } from "../utils/arg";
import { getActiveEditorFilePath } from "../utils/getActiveEditorFilePath";
import _ from "lodash";

const run = async () => {
  const name = await arg({
    message: "What is the name of the problem/solution?",
  }).then(_.kebabCase);

  const currentFile = await getActiveEditorFilePath();

  const currentDir = path.dirname(currentFile);

  const defaultNum = await (async () => {
    const filesInDir = await readdir(currentDir);

    const lastFileInDir = _.last(filesInDir);

    if (!lastFileInDir) {
      return "00";
    }
    const startOfLastFileInDir = lastFileInDir.split("-")[0];

    const num = Math.ceil(Number(startOfLastFileInDir));

    if (isNaN(num)) {
      return "00";
    }

    return `${num + 1}`.padStart(2, "0");
  })();

  const num = await arg({
    message: "What is the number of the problem/solution?",
    initial: defaultNum,
  });

  const problemFileName = `${num}-${name}.problem.ts`;
  const solutionFileName = `${num}-${name}.solution.ts`;

  const problemFile = path.join(currentDir, problemFileName);
  const solutionFile = path.join(currentDir, solutionFileName);

  await writeFile(problemFile, "");
  await writeFile(solutionFile, "");

  await $`code ${solutionFile}`;
};

export const add_new_problem_solutionInfo = {
  run,
  title: "Add New Problem/Solution",
};
