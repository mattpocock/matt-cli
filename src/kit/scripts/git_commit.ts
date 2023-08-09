const run = async () => {
  // current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  $.verbose = true;

  await $`git add -A && git commit -m "${currentDate}" && git push`;
};

export const git_commitInfo = {
  run,
  title: "Auto Commit",
};
