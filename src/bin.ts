#!/usr/bin/env node

import "zx/globals";

import * as cfonts from "cfonts";
import { Command } from "commander";
import { blitz } from "./blitz";
import { checkout } from "./checkout";
import { pr } from "./pr";
import { pullParent } from "./pullParent";
import open from "open";
import { goals } from "./goals";
import { dotfile, kmap } from "./kmap";
import { showAndTell } from "./showAndTell";
import { init } from "./init";
import { main } from "./main";
import { reorder } from "./reorder";
import { shuffle } from "./shuffle";
import { kitMain } from "./kit/main";
$.verbose = false;

const program = new Command();

program.version("0.0.1");

program.action(kitMain);

program.command("pr").action(pr);

program.command("pull-parent").action(pullParent);
program.command("pp").action(pullParent);

program.command("checkout <branch>").action(checkout);

program.command("blitz").action(blitz);
program.command("open").action(() => {
  open(`http://localhost:3000/editor`);
});
program.command("goals").action(goals);
program.command("kmap").action(kmap);
program.command("dotfile").action(dotfile);
program.command("show-and-tell").action(showAndTell);
program
  .command("init")
  .option("-p, --pnpm", "use pnpm for installation")

  .action(init);
program.command("main").action(main);
program.command("pomo").action(() => {
  let secondsToCount = 60 * 25;
  const interval: NodeJS.Timer = setInterval(() => {
    if (secondsToCount === 0) {
      return clearInterval(interval);
    }

    const minutes = Math.floor(secondsToCount / 60);
    const seconds = `${secondsToCount % 60}`;
    console.clear();
    cfonts.say(`${minutes}:${seconds.length === 1 ? `0${seconds}` : seconds}`, {
      env: "node",
      font: "3d",
      align: "center",
      colors: ["white", "gray"],
    });
    secondsToCount--;
  }, 1000);

  process.on("beforeExit", () => {
    clearInterval(interval);
  });
});

program.command("reorder <path>").action(reorder);
program.command("shuffle <path> <targetPrefix> <newPrefix>").action(shuffle);

program.parse(process.argv);
