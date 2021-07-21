#!/usr/bin/env node

import { Command } from "commander";
import { pr } from "./pr";

const program = new Command();

program.version("0.0.1");

program.command("pr").action(pr);

program.parse(process.argv);
