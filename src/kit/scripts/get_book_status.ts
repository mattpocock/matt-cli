import { getExerciseReports } from "../utils/exerciseFiles";

const DESIRED_EXERCISES = 240;

const run = async () => {
  const exerciseReports = await getExerciseReports();
  const totalExercises = exerciseReports.length;

  const writtenExercises = exerciseReports.filter((e) =>
    ["written", "recorded"].includes(e.status),
  ).length;

  const recordedExercises = exerciseReports.filter(
    (e) => e.status === "recorded",
  ).length;

  const toPercentage = (num: number, max: number) => {
    return `${num}/${max} (${((num / max) * 100).toFixed(1)}%)`;
  };

  const report = [
    `Exercises Sketched: ${toPercentage(totalExercises, DESIRED_EXERCISES)}`,
    `Exercises Written: ${toPercentage(writtenExercises, DESIRED_EXERCISES)}`,
    `Exercises Recorded: ${toPercentage(recordedExercises, DESIRED_EXERCISES)}`,
    `Total Progress: ${toPercentage(
      writtenExercises + recordedExercises + totalExercises,
      DESIRED_EXERCISES * 3,
    )}`,
  ].join("\n");

  console.log(report);
};

export const get_book_statusInfo = {
  run,
  title: "Get Workshop Status",
};
