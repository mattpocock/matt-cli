import { readFile, writeFile } from "fs/promises";
import { home } from "../utils/home";

const getVSCodeSettingsFileContents = async () => {
  const fileContents = await readFile(
    home("Library/Application Support/Code/User/settings.json"),
    {
      encoding: "utf-8",
    },
  );

  const lines = fileContents.split("\n");

  return {
    lines,
    mode: lines[0].startsWith("//") ? "recording" : "dev",
  } as const;
};

const _toggleVSCodeSettings = async (lines: string[]) => {
  const newFile = lines
    .map((line) => {
      if (line.startsWith("//")) {
        return line.slice(2);
      } else {
        return "//" + line;
      }
    })
    .join("\n");

  await writeFile(
    home("Library/Application Support/Code/User/settings.json"),
    newFile,
  );
};

const toggleVSCodeSettings = async () => {
  const { lines } = await getVSCodeSettingsFileContents();

  await _toggleVSCodeSettings(lines);
};

export const toggleVSCodeSettingsInfo = {
  title: "Toggle VSCode Settings",
  run: toggleVSCodeSettings,
};

export const setVSCodeToRecordingMode = async () => {
  const { lines, mode } = await getVSCodeSettingsFileContents();

  if (mode === "dev") {
    await _toggleVSCodeSettings(lines);
  }
};

export const setVSCodeToDevMode = async () => {
  const { lines, mode } = await getVSCodeSettingsFileContents();

  if (mode === "recording") {
    await _toggleVSCodeSettings(lines);
  }
};
