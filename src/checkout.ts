import { exec } from "./exec";

export const checkout = (branch: string) => {
  console.log(`Checking out ${branch}`);

  // Checkout branch
  exec(`git checkout ${branch}`);

  // Pull branch
  exec(`git pull`);

  // // Run yarn install
  // exec(`yarn install`);
};
