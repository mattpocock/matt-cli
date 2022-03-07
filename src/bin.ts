#!/usr/bin/env node

import { Command } from "commander";
import { blitz } from "./blitz";
import { checkout } from "./checkout";
import { pr } from "./pr";
import { pullParent } from "./pullParent";
import open from "open";
import { goals } from "./goals";
import { dotfile, kmap } from "./kmap";

const program = new Command();

program.version("0.0.1");

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

program.parse(process.argv);
