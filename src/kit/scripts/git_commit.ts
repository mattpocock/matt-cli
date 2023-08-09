const run = async () => {
  const currentDate = new Date().toISOString();

  $.verbose = true;

  await spinner(
    "Committing...",
    () => $`git add -A && git commit -m "${currentDate}" && git push`,
  );

  console.log("Auto commit complete!");
};

export const git_commitInfo = {
  run,
  title: "Auto Commit",
};
