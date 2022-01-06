#!/usr/bin/env node

import { Command } from "commander";
import { pr } from "./pr";
import { pullParent } from "./pullParent";

const program = new Command();

program.version("0.0.1");

program.command("pr").action(pr);

program.command("pull-parent").action(pullParent);
program.command("pp").action(pullParent);

program.parse(process.argv);
