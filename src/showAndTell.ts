import { execSync } from "child_process";
import prompts from "prompts";
import { exec } from "./exec";

export const showAndTell = async () => {
  // Check GitHub exists
  execSync("gh --version", {
    stdio: "ignore",
  });

  const { baseRefName } = JSON.parse(
    execSync("gh pr view --json baseRefName").toString(),
  );

  const branchName = execSync("git branch --show-current").toString().trim();

  execSync(`git checkout ${baseRefName}`);

  console.log(`BEFORE: ${baseRefName}`);

  await prompts({
    name: "confirm",
    type: "confirm",
    message: "Finished demo-ing?",
  });

  console.log(`AFTER: ${branchName}`);

  execSync(`git checkout ${branchName}`);
};
