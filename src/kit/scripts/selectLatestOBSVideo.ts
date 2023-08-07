const selectLatestOBSVideo = async () => {
  const { stdout } = await $`ls -t /Volumes/T7\\ Shield/Movies/*.mp4`;

  const inputVideo = stdout.trim().split("\n")[0].trim();

  await $`open -R ${inputVideo}`;
};

export const selectLatestOBSVideoInfo = {
  title: "Select Latest OBS Video",
  run: selectLatestOBSVideo,
};
