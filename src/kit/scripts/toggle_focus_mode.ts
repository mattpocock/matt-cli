import { readFile, writeFile } from "fs/promises";

const SITES_TO_BLOCK = [
  "twitter.com",
  "www.twitter.com",
  "youtube.com",
  "studio.youtube.com",
  "whatsapp.com",
  "web.whatsapp.com",
  "gmail.com",
  "app.convertkit.com",
  "slack.com",
  "discord.com",
];

const LINES_TO_DELETE = SITES_TO_BLOCK.map((site) => {
  return `127.0.0.1 ${site}`;
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

  try {
    await writeFile(LOCATION, newLines.join("\n"));
    console.log(isInFocusMode ? "Focus mode disabled!" : "Focus mode enabled!");
  } catch (e) {
    console.log("Error writing to file. Try running again with sudo.");
  }
};

export const toggle_focus_modeInfo = {
  run,
  title: "Toggle Focus Mode",
};
