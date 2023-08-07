import { ensureDir } from "fs-extra";
import { parse, resolve } from "path";
import { home } from "../utils/home";
import { getActiveEditorFilePath } from "../utils/getActiveEditorFilePath";

const run = async () => {
  const activeEditorFilePath = await getActiveEditorFilePath();

  const rawFilename = path.relative(home("repos"), activeEditorFilePath);

  if (rawFilename.startsWith("..")) {
    console.log("File is not in the repos folder");
    process.exit(1);
  }

  const outputFolder = path.dirname(rawFilename);
  const outputFilename = path.parse(rawFilename).name + ".mp4";

  const resolvedFilename = path.resolve(
    "/Volumes",
    "T7 Shield",
    "Movies",
    outputFolder,
    outputFilename,
  );

  await $`open ${path.dirname(resolvedFilename)}`;
};

export const openPairedVideoDirInfo = {
  title: "Open Paired Video Dir",
  run,
};
