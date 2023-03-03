import { execSync } from "child_process";
import { checkout } from "./checkout";

export const main = (opts: { p: boolean }) => {
  const result = JSON.parse(
    execSync(`gh repo view --json defaultBranchRef`).toString(),
  );

  const branchName = result.defaultBranchRef.name;

  checkout(branchName);
};
