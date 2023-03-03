import { exec } from "./exec";

export const init = (opts: { pnpm?: boolean }) => {
  exec("git init");
  if (opts.pnpm) {
    exec("pnpm init");
    exec("pnpm add -D typescript @types/node");
    exec("pnpm tsc --init");
  } else {
    exec("yarn init -y");
    exec("yarn add -D typescript @types/node");
    exec("yarn tsc --init");
  }
  exec("mkdir src");
  exec("touch src/index.ts");
  exec('echo "node_modules" > .gitignore');
};
