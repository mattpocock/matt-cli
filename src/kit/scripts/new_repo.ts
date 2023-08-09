import { readdir } from "fs/promises";
import { home } from "../utils/home";
import { arg, choose } from "../utils/arg";
import { ensureDir } from "fs-extra";

const run = async () => {
  const dirs = await readdir(home("repos"));

  const dir = await choose({ message: "Directory", choices: dirs });

  const name = await arg({
    message: "Name",
  });

  const fullDir = home("repos", dir, name);

  await ensureDir(fullDir);

  $.verbose = true;

  await $`cd ${fullDir} && matt init --pnpm`;

  await $`code ${fullDir}`;
};

export const new_repoInfo = {
  run,
  title: "New Repo",
};
