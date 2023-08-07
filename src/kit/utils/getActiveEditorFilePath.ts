import { readJson } from "fs-extra";
import { readFile, writeFile } from "fs/promises";
import { z } from "zod";
import { home } from "./home";

export const getActiveEditorFilePath = async (): Promise<string> => {
  const result = await readJson(home(`.kit`, "db", "vscode.json"));

  const vscodeResultSchema = z.object({
    activeTextEditorFilePath: z.string().nullable(),
  });

  const activeEditorFilePath =
    vscodeResultSchema.parse(result).activeTextEditorFilePath;

  if (!activeEditorFilePath) {
    throw new Error("Active editor file path not found");
  }

  return activeEditorFilePath;
};

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

export const toggleVSCodeSettings = async () => {
  const { lines } = await getVSCodeSettingsFileContents();

  await _toggleVSCodeSettings(lines);
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
