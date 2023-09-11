import { getExerciseReports } from "../utils/exerciseFiles";

const run = async () => {
  const exerciseReports = await getExerciseReports();

  const nextExercise = exerciseReports.find(
    (e) => e.status === "empty" || e.status === "todo-found",
  );

  if (!nextExercise) {
    console.log("No exercises left!");
    return;
  }

  await $`code ${nextExercise.path}`;
};

export const get_next_exerciseInfo = {
  run,
  title: "Get Next Exercise",
};
