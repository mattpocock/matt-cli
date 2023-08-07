import { ensureDir } from "fs-extra";
import { parse, resolve } from "path";

const run = async () => {
  const BASE_FOLDER = "/Volumes/T7 Shield/Movies";

  const folders = [
    resolve(BASE_FOLDER, "ts", "advanced-patterns-workshop"),
    resolve(BASE_FOLDER, "ts", "typescript-generics-tutorial"),
    resolve(BASE_FOLDER, "ts", "type-transformations"),
    resolve(BASE_FOLDER, "ts", "react-typescript-tutorial"),
    resolve(BASE_FOLDER, "ts", "video-ideas"),
    resolve(BASE_FOLDER, "one-shots"),
    resolve(BASE_FOLDER, "matt"),
  ];

  for (const folder of folders) {
    const { stdout } = await $`find ${folder} -type f -name "*.mp4"`;

    const inputVideos = stdout
      .trim()
      .split("\n")
      .filter((file) => !parse(file).name.startsWith("."))
      .filter((file) => {
        // Should not be in the tests folder
        return !parse(file).dir.endsWith("tests");
      })
      .filter((file) => {
        return (
          // Should not be in an un-encoded folder
          !parse(file).dir.endsWith("un-encoded") &&
          // Should be a file that ends un-encoded.mp4
          file.endsWith("un-encoded.mp4")
        );
      });

    let videoCount = 0;

    for (const videoPath of inputVideos) {
      videoCount++;
      const outputVideoPath = videoPath.replace(".un-encoded.mp4", ".mp4");
      console.log(outputVideoPath);
      console.log(
        `Encoding ${path.parse(outputVideoPath).name} (${videoCount}/${
          inputVideos.length
        })`,
      );

      await $`ffmpeg -y -hide_banner -i ${videoPath} -c:v libx264 -profile high -b:v 7000k -pix_fmt yuv420p -maxrate 16000k ${outputVideoPath}`;
      $.verbose = true;

      await ensureDir(resolve(parse(outputVideoPath).dir, "un-encoded"));

      $.verbose = false;

      await $`mv ${videoPath} ${resolve(
        parse(outputVideoPath).dir,
        "un-encoded",
        parse(videoPath).base,
      )}`;
    }
  }
};

export const encodeAllVideosInfo = {
  title: "Encode all videos",
  run,
};
