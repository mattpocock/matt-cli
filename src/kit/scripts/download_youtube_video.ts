import { arg } from "../utils/arg";

const run = async () => {
  const url = await arg({
    message: "What is the URL of the YouTube video?",
  });

  const filename = await arg({
    message: "What is the filename?",
    initial: "video.mp4",
  });

  $.verbose = true;

  await $`yt-dlp ${url} -o ${filename} --format bestvideo+bestaudio --recode mp4`;
};

export const download_youtube_videoInfo = {
  run,
  title: "Download YouTube Video",
};
