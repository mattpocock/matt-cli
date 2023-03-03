import prompts from "prompts";
import * as path from "path";
import * as fs from "fs/promises";
import open from "open";

const dbPath = path.resolve(__dirname, "../kmap.json");

type DB = Record<
  string,
  { name: string; description: string; deps: string[]; color?: string }
>;

const kMapToDotFile = (db: DB) => {
  const deepDependencies = getDeepDependencies(db);
  return `
  digraph kmap {
    ${Object.values(db)
      .map((node) => {
        return `
        ${node.color ? `"${node.name}" [color=${node.color}]` : ``}
        ${node.deps
          .filter((dep) => {
            return !deepDependencies[node.name]?.[dep];
          })
          .map((dep) => {
            return `"${dep}" -> "${node.name}"`;
          })
          .join("\n")}`;
      })
      .join("\n")}
  }
  `;
};

export const dotfile = async () => {
  const db = await fs.readFile(dbPath, "utf8");

  const dotfile = kMapToDotFile(JSON.parse(db));

  open(
    `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dotfile)}`,
  );
};

const getDeepDependencies = (db: DB): Record<string, Record<string, true>> => {
  const deps: Record<string, Record<string, true>> = {};

  const getDeepDepsOfEntry = (
    deps: string[],
    depSet = new Set<string>(),
    depth = 0,
  ) => {
    if (depth > 0) {
      deps.forEach((dep) => {
        depSet.add(dep);
      });
    }
    deps.forEach((dep) => {
      if (!db[dep]) {
        return;
      }
      getDeepDepsOfEntry(db[dep].deps, depSet, depth + 1);
    });
    return depSet;
  };

  Object.values(db).forEach((entry) => {
    const depSet = getDeepDepsOfEntry(entry.deps);

    deps[entry.name] = {};

    Array.from(depSet).forEach((dep) => {
      deps[entry.name][dep] = true;
    });
  });

  return deps;
};

export const kmap = async () => {
  while (true) {
    let db = JSON.parse(await fs.readFile(dbPath, "utf8"));
    // Which node do you want to add?

    const { node } = await prompts({
      name: "node",
      type: "text",
      message: "What is the name of the node you want to add?",
    });

    if (!node) break;

    // // Add a description for that node

    // const { description } = await prompts({
    //   name: "description",
    //   type: "text",
    //   message: "What is the description of the node you want to add?",
    // });

    // Which dependencies does this node have?

    let deps: string[] = [];

    if (Object.values(db).length > 0) {
      const result = await prompts({
        name: "deps",
        type: "autocompleteMultiselect",
        message: "Which dependencies do you want to add?",
        choices: Object.keys(db).map((name) => ({ title: name, value: name })),
      });
      if (!result.deps || result.deps.length === 0) break;
      deps = result.deps;
    }

    db = JSON.parse(await fs.readFile(dbPath, "utf8"));

    // Add the node to the database

    db[node] = {
      name: node,
      description: "",
      deps,
    };

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  }
};
