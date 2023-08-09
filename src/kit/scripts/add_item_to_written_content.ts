import { readdir } from "fs/promises";
import { home } from "../utils/home";
import { arg, choose } from "../utils/arg";
import _ from "lodash";

const run = async () => {
  const writtenContentDir = home("repos", "ts", "written-content");

  const dirsToIgnore = ["node_modules", "_old"];

  const dirs = await readdir(writtenContentDir).then((dirs) =>
    dirs.filter((dir) => !dir.includes(".") && !dirsToIgnore.includes(dir)),
  );

  const dir = await choose({
    choices: dirs,
    message: "Which dir?",
  }).then(_.kebabCase);

  const absoluteDir = path.join(writtenContentDir, dir);

  const newFileName = await arg({
    message: "Name of the new dir?",
  }).then(_.kebabCase);

  await $`cp -r ${path.join(absoluteDir, "_base")} ${path.join(
    absoluteDir,
    newFileName,
  )}`;

  await arg({
    message: "Press enter to open the new file in VSCode",
  });

  await $`code ${path.join(absoluteDir, newFileName, "checklist.md")}`;
};

export const add_item_to_written_contentInfo = {
  run,
  title: "Add Item To Written Content",
};
