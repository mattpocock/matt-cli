import { homedir } from "os";

export const home = (...pathParts: string[]) => {
  return path.resolve(homedir(), ...pathParts);
};
