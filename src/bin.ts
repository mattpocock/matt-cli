#!/usr/bin/env node

import { Command } from "commander";
import { main } from "./main";
import { pr } from "./pr";

const program = new Command();

program.version("0.0.1");

program.command("pr").action(pr);

program.command("main").action(main);

program.parse(process.argv);
