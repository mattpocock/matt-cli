import prompts from "prompts";
import * as path from "path";
import * as fs from "fs/promises";
import open from "open";

const dbPath = path.resolve(__dirname, "../kmap.json");

const kMapToDotFile = (
  db: Record<string, { name: string; description: string; deps: string[] }>,
) => {
  return `
  digraph kmap {
    ${Object.values(db)
      .map((node) => {
        return node.deps
          .map((dep) => {
            return `"${dep}" -> "${node.name}"`;
          })
          .join("\n");
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

    // Add a description for that node

    const { description } = await prompts({
      name: "description",
      type: "text",
      message: "What is the description of the node you want to add?",
    });

    // Which dependencies does this node have?

    const { deps } = await prompts({
      name: "deps",
      type: "autocompleteMultiselect",
      message: "Which dependencies do you want to add?",
      choices: Object.keys(db).map((name) => ({ title: name, value: name })),
    });
    if (!deps || deps.length === 0) break;

    db = JSON.parse(await fs.readFile(dbPath, "utf8"));

    // Add the node to the database

    db[node] = {
      name: node,
      description,
      deps,
    };

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  }
};
