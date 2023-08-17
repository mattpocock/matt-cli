import { ensureDir } from "fs-extra";
import { getActiveEditorFilePath } from "../utils/getActiveEditorFilePath";
import { rm } from "fs/promises";
import { EXERCISE_NUMBER_LENGTH } from "../../constants";

const run = async () => {
  const activeFile = await getActiveEditorFilePath();

  if (!activeFile.endsWith(".md")) {
    console.log("Not a markdown file!");
    return;
  }

  const dir = path.dirname(activeFile);

  const fileContent = await fs.readFile(activeFile, "utf8");

  const codeSamples = fileContent.match(/```(.*?)```/gs)!.map(String);

  let i = 0;

  await rm(path.resolve(dir, "code-samples"), {
    recursive: true,
    force: true,
  });

  await ensureDir(path.resolve(dir, "code-samples"));

  for (const codeSample of codeSamples) {
    i++;

    const transformedSample = codeSample
      .split("\n")
      .filter((line) => {
        return !line.startsWith("```");
      })
      .filter((line) => !line.includes("^?"))
      .filter((line) => !line.includes("@errors:"))
      .join("\n");

    const isTsx = codeSample.includes("tsx");

    const fileName = `${String(i).padStart(EXERCISE_NUMBER_LENGTH, "0")}.${
      isTsx ? "tsx" : "ts"
    }`;

    await fs.writeFile(
      path.resolve(dir, "code-samples", fileName),
      transformedSample,
    );
  }
};

export const code_samples_from_markdown_fileInfo = {
  run,
  title: "Code samples from markdown file",
};
