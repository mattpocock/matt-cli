import { exec } from "./exec";
import * as path from "path";
import fg from "fast-glob";

export const shuffle = (
  baseFilePath: string,
  targetPrefix: string,
  newPrefix: string,
) => {
  fg.sync(path.join(baseFilePath, `**/**/${targetPrefix}-*.ts`)).forEach(
    (p) => {
      /**
       * Remove targetPrefix and replace it with newPrefix
       */

      const oldBase = path.parse(p).base;

      const newBase = oldBase.replace(targetPrefix, newPrefix);

      const newPath = p.replace(oldBase, newBase);

      exec(`mv ${p} ${newPath}`);
    },
  );
};
