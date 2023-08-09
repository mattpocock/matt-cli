import { writeFile } from "fs/promises";
import { arg } from "../utils/arg";
import { getActiveEditorFilePath } from "../utils/getActiveEditorFilePath";

const run = async () => {
  const currentFile = await getActiveEditorFilePath();

  const currentDir = path.dirname(currentFile);

  const name = await arg({
    message: "What is the name of the problem/solution?",
  }).then((name) => name.trim());

  const problemFileName = `${name}.problem.ts`;
  const solutionFileName = `${name}.solution.ts`;

  const problemFile = path.join(currentDir, problemFileName);
  const solutionFile = path.join(currentDir, solutionFileName);

  await writeFile(problemFile, "");
  await writeFile(solutionFile, "");
};

export const add_new_problem_solutionInfo = {
  run,
  title: "Add New Problem/Solution",
};
