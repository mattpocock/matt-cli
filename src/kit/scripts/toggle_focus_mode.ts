import { readFile, writeFile } from "fs/promises";

const SITES_TO_BLOCK = ["twitter.com", "youtube.com"];

const LINES_TO_DELETE = SITES_TO_BLOCK.flatMap((site) => {
  return [`127.0.0.1 ${site}`, `127.0.0.1 www.${site}`];
});

const run = async () => {
  const LOCATION = "/etc/hosts";

  const contents = await readFile(LOCATION, "utf8");

  const lines = contents.split("\n");

  let isInFocusMode = false;

  const newLines = lines
    .filter((line) => {
      const hasLine = LINES_TO_DELETE.some((l) => line.includes(l));

      if (hasLine) {
        isInFocusMode = true;
      }
      return !hasLine;
    })
    .filter((line) => line.trim() !== "");

  if (!isInFocusMode) {
    newLines.push(...LINES_TO_DELETE);
  }

  console.log(isInFocusMode ? "Focus mode disabled!" : "Focus mode enabled!");

  await writeFile(LOCATION, newLines.join("\n"));
};

export const toggle_focus_modeInfo = {
  run,
  title: "Toggle Focus Mode",
};
