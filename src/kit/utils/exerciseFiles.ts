import { readFile, stat } from "fs/promises";
import { exists } from "fs-extra";
import FastGlob from "fast-glob";
import { home } from "./home";

const RECORDING_FILE_PATH = path.resolve("/Volumes", "T7 Shield", "Movies");

const REPOS_FILE_PATH = home("repos");

export const getAllExerciseFiles = () => {
  return FastGlob(
    "**/[0123456789][0123456789]?([0123456789])*{problem,solution,explainer}*",
    {
      onlyFiles: false,
    },
  );
};

export const getExerciseReports = async () => {
  const cwd = path.relative(REPOS_FILE_PATH, process.cwd());
  const exerciseFiles = await getAllExerciseFiles();

  const exerciseReports = new Map<
    string,
    {
      status: "empty" | "todo-found" | "written" | "recorded";
      path: string;
      section: string;
    }
  >();

  for (const exercisePath of exerciseFiles) {
    const section = exercisePath.split("/")[1];

    const isSolution = exercisePath.includes("solution");

    const exerciseId = path.parse(exercisePath).name.split("-")[0];

    if (isSolution) {
      continue;
    }

    const isDir = await stat(exercisePath).then((s) => s.isDirectory());

    let exercise: {
      status: "empty" | "todo-found" | "written" | "recorded";
      path: string;
      section: string;
    };

    if (isDir) {
      exercise = {
        status: "written",
        path: exercisePath,
        section,
      };
    } else {
      const fileContents = await readFile(exercisePath, "utf8");

      if (fileContents.trim() === "") {
        exercise = {
          status: "empty",
          path: exercisePath,
          section,
        };
      } else if (fileContents.includes("TODO")) {
        exercise = {
          status: "todo-found",
          path: exercisePath,
          section,
        };
      } else {
        exercise = {
          status: "written",
          path: exercisePath,
          section,
        };
      }
    }

    if (exercise.status === "written") {
      const recordingPath = (() => {
        const fullPath = path.resolve(RECORDING_FILE_PATH, cwd, exercisePath);

        // Remove the extension if it exists
        const parsed = path.parse(fullPath);

        return path.resolve(parsed.dir, parsed.name + ".mp4");
      })();

      const recordingExists = await exists(recordingPath);

      if (recordingExists) {
        exercise.status = "recorded";
      }
    }

    exerciseReports.set(exerciseId, exercise);
  }

  return Array.from(exerciseReports.values());
};
