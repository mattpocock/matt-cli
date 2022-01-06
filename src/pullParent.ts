import { execSync } from "child_process";
import { exec } from "./exec";

export const pullParent = () => {
  // Check GitHub exists
  execSync("gh --version", {
    stdio: "ignore",
  });

  exec("git pull");

  const { baseRefName } = JSON.parse(
    execSync("gh pr view --json baseRefName").toString(),
  );

  exec(`git pull origin ${baseRefName}`);
};
