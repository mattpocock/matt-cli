import { ensureDir } from "fs-extra";
import { getActiveEditorFilePath } from "../utils/getActiveEditorFilePath";
import { home } from "../utils/home";
import { arg } from "../utils/arg";

const trimLatestOBSVideo = async () => {
  const { stdout } = await $`ls -t /Volumes/T7\\ Shield/Movies/*.mp4`;

  const inputVideo = stdout.trim().split("\n")[0].trim();

  const THRESH = "-27";
  const DURATION = "1";

  const activeEditorFilePath: string | null = await getActiveEditorFilePath();

  const rawRelativeFilename = path.relative(
    home("repos"),
    activeEditorFilePath,
  );

  if (!activeEditorFilePath) {
    throw new Error("Active editor file path not found");
  }

  if (rawRelativeFilename.startsWith("..")) {
    console.log("File is not in the repos folder");
    process.exit(1);
  }

  const filename = await arg({
    message: "Confirm File name",
    initial: activeEditorFilePath,
  });

  if (!filename) {
    process.exit(0);
  }

  const resolvedFilename = path.resolve(
    `/Volumes/T7 Shield`,
    "Movies",
    rawRelativeFilename,
  );

  const outputFolder = path.dirname(resolvedFilename);
  const outputFilename = path.parse(resolvedFilename).name + ".un-encoded.mp4";

  console.log("Finding silence...");

  $.verbose = false;
  const output =
    await $`ffmpeg -hide_banner -vn -i ${inputVideo} -af "silencedetect=n=${THRESH}dB:d=${DURATION}" -f null - 2>&1 | grep "silence_end" | awk '{print $5 " " $8}'`;

  let silence = output.stdout
    .trim()
    .split("\n")
    .map((line) => line.split(" "))
    .map(([silenceEnd, duration]) => {
      return {
        silenceEnd: parseFloat(silenceEnd),
        duration: parseFloat(duration),
      };
    });

  let foundFirstPeriodOfTalking = false;

  while (!foundFirstPeriodOfTalking) {
    // Unshift the first silence if the noise afterwards
    // is less than 1 second long
    const silenceElem = silence[0];
    const nextSilenceElem = silence[1];

    const nextSilenceStartTime =
      nextSilenceElem.silenceEnd - nextSilenceElem.duration;

    const lengthOfNoise = nextSilenceStartTime - silenceElem.silenceEnd;

    if (lengthOfNoise < 2) {
      silence.shift();
    } else {
      foundFirstPeriodOfTalking = true;
    }
  }

  const PADDING = 0.3;

  const startTime = silence[0].silenceEnd - PADDING;

  const endTime =
    silence[silence.length - 1].silenceEnd -
    silence[silence.length - 1].duration +
    PADDING;

  const totalDuration = endTime - startTime;

  const formatFloatForFFmpeg = (num: number) => {
    return num.toFixed(3);
  };

  await ensureDir(outputFolder);
  const outputVideo = path.resolve(outputFolder, outputFilename);

  await ensureDir(path.resolve(outputFolder, "tests"));
  const testOutputVideo = path.resolve(outputFolder, "tests", outputFilename);

  console.log("Trimming video...");

  await $`ffmpeg -y -hide_banner -ss ${formatFloatForFFmpeg(
    startTime,
  )} -to ${formatFloatForFFmpeg(
    endTime,
  )} -i ${inputVideo} -c copy ${outputVideo}`;

  console.log("Trimming test video...");

  await $`ffmpeg -y -i ${outputVideo} \
  -vf "select='between(t,0,2)+between(t,${(totalDuration - 2).toFixed(
    1,
  )},${totalDuration.toFixed(1)})',
      setpts=N/FRAME_RATE/TB" \
  -af "aselect='between(t,0,2)+between(t,${(totalDuration - 2).toFixed(
    1,
  )},${totalDuration.toFixed(1)})',
      asetpts=N/SR/TB" ${testOutputVideo}`;

  await $`open ${testOutputVideo}`;
};

export const trimLatestOBSVideoInfo = {
  title: "Trim Latest OBS Video",
  run: trimLatestOBSVideo,
};
