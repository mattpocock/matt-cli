import { readdir, writeFile } from "fs/promises";
import { arg } from "../utils/arg";
import { getActiveEditorFilePath } from "../utils/getActiveEditorFilePath";
import _ from "lodash";
import { EXERCISE_NUMBER_LENGTH } from "../../constants";

const defaultExerciseNumber = "0".padStart(EXERCISE_NUMBER_LENGTH, "0");

const run = async () => {
  const name = await arg({
    message: "What is the name of the problem/solution?",
  }).then(_.kebabCase);

  const currentFile = await getActiveEditorFilePath();

  const currentDir = path.dirname(currentFile);

  const defaultNum = await (async () => {
    const filesInDir = await readdir(currentDir).then((files) => {
      return files.filter((file) => {
        return file.endsWith(".ts") || file.endsWith(".tsx");
      });
    });

    const lastFileInDir = _.last(filesInDir);

    if (!lastFileInDir) {
      return defaultExerciseNumber;
    }
    const startOfLastFileInDir = lastFileInDir.split("-")[0];

    const num = Math.ceil(Number(startOfLastFileInDir));

    if (isNaN(num)) {
      return defaultExerciseNumber;
    }

    return `${num + 1}`.padStart(EXERCISE_NUMBER_LENGTH, "0");
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
};

export const add_new_problem_solutionInfo = {
  run,
  title: "Add New Problem/Solution",
};
