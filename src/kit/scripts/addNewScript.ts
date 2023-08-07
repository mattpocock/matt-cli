import { arg } from "../utils/arg";
import * as path from "path";
import { home } from "../utils/home";
import { readFile, writeFile } from "fs/promises";

const COMPONENTS = {
  scriptFile: (opts: { filename: string; title: string }) => {
    return [
      `const run = async () => {};`,
      ``,
      `export const ${opts.filename}Info = {`,
      `  run,`,
      `  title: '${opts.title}'`,
      `};`,
    ].join("\n");
  },
  importLine: (opts: { filename: string }) =>
    `import { ${opts.filename}Info } from './scripts/${opts.filename}';`,
  scriptLine: (opts: { filename: string }) => `  ${opts.filename}Info,`,
};

const toSnakeCase = (str: string) => {
  return str.trim().split(" ").join("_").toLowerCase();
};

const run = async () => {
  const title = await arg({
    message: "What is the title of the script?",
  });

  const filename = toSnakeCase(title);

  const SCRIPT_PATH = home(
    "repos",
    "matt",
    "matt-cli",
    "src",
    "kit",
    "scripts",
  );

  const scriptFile = path.join(SCRIPT_PATH, `${filename}.ts`);

  await writeFile(scriptFile, COMPONENTS.scriptFile({ filename, title }));

  const MAIN_FILE = home("repos", "matt", "matt-cli", "src", "kit", "main.ts");

  const mainFile = await readFile(MAIN_FILE);

  const mainFileLines = mainFile.toString().split("\n");

  // Insert COMPONENTS.scriptLine after a
  // line containing 'const scripts = {'

  const insertIndex = mainFileLines.findIndex((line) =>
    line.includes("const scripts = {"),
  );

  mainFileLines.splice(insertIndex + 1, 0, COMPONENTS.scriptLine({ filename }));

  // Insert COMPONENTS.importLine at the top

  mainFileLines.splice(0, 0, COMPONENTS.importLine({ filename }));

  await writeFile(MAIN_FILE, mainFileLines.join("\n"));

  await $`code ${scriptFile}`;
};

export const addNewScriptInfo = {
  title: "Add New Script",
  run,
};
