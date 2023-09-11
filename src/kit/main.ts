import { get_next_exerciseInfo } from './scripts/get_next_exercise';
import { get_book_statusInfo } from './scripts/get_book_status';
import { code_samples_from_markdown_fileInfo } from './scripts/code_samples_from_markdown_file';
import { download_youtube_videoInfo } from './scripts/download_youtube_video';
import { add_new_problem_solutionInfo } from './scripts/add_new_problem_solution';
import { toggle_focus_modeInfo } from './scripts/toggle_focus_mode';
import { new_repoInfo } from './scripts/new_repo';
import { git_commitInfo } from './scripts/git_commit';
import { add_item_to_written_contentInfo } from './scripts/add_item_to_written_content';
import { select_latest_davinci_resolve_exportInfo } from './scripts/select_latest_davinci_resolve_export';
import prompts, { prompt } from "prompts";
import { trimLatestOBSVideoInfo } from "./scripts/trimLatestOBSVideo";
import { toggleVSCodeSettingsInfo } from "./scripts/toggleVSCodeSettings";
import { encodeAllVideosInfo } from "./scripts/encodeAllVideos";
import { openPairedVideoDirInfo } from "./scripts/openPairedVideoDir";
import { selectLatestOBSVideoInfo } from "./scripts/selectLatestOBSVideo";
import { addNewScriptInfo } from "./scripts/addNewScript";

const scripts = {
  get_next_exerciseInfo,
  get_book_statusInfo,
  code_samples_from_markdown_fileInfo,
  download_youtube_videoInfo,
  add_new_problem_solutionInfo,
  toggle_focus_modeInfo,
  new_repoInfo,
  git_commitInfo,
  add_item_to_written_contentInfo,
  select_latest_davinci_resolve_exportInfo,
  addNewScriptInfo,
  trimLatestOBSVideoInfo,
  toggleVSCodeSettingsInfo,
  encodeAllVideosInfo,
  openPairedVideoDirInfo,
  selectLatestOBSVideoInfo,
} satisfies Record<
  string,
  {
    title: string;
    run: () => Promise<void>;
  }
>;

export const kitMain = async () => {
  const script = await prompts({
    message: "Which script would you like to run?",
    name: "script",
    type: "autocomplete",
    choices: Object.entries(scripts).map(([value, script]) => ({
      title: script.title,
      value,
    })),
  });

  if (!script.script) {
    process.exit(0);
  }

  await scripts[script.script as keyof typeof scripts].run();
};
