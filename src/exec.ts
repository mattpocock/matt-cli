import { execSync } from "child_process";

export const exec = (cmd: string) => {
  return execSync(cmd, {
    stdio: "inherit",
  });
};
