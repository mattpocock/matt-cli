const run = async () => {
  const { stdout } = await $`ls -t /Volumes/T7\\ Shield/Exports/*.mp4`;

  const inputVideo = stdout.trim().split("\n")[0].trim();

  await $`open -R ${inputVideo}`;
};

export const select_latest_davinci_resolve_exportInfo = {
  run,
  title: "Select Latest Davinci Resolve Export",
};
