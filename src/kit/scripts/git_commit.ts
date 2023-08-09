const run = async () => {
  // current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

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
