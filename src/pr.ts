import { exec } from "./exec";
import { assign, createMachine, interpret } from "xstate";
import prompts from "prompts";
import { execSync } from "child_process";
import { makePromptService } from "./makePromptService";

interface Context {
  issueName?: string;
  prTitle?: string;
  currentBranch?: string;
  isDraft: boolean;
}

type Event =
  | {
      type: "HAS_NO_STAGED_CHANGES";
    }
  | {
      type: "UNSTAGE_CHANGE_CHECK_COMPLETE";
    };

const charsToRemove = /(\.|,|'|\/)/g;

const fixBranchName = (message: string) =>
  message
    .split(" ")
    .map((word) => word.toLowerCase().replace(charsToRemove, ""))
    .join("-");

const machine = createMachine<Context, Event>({
  initial: "checkingIfHasGithubCliInstalled",
  context: {
    isDraft: false,
  },
  states: {
    checkingIfHasGithubCliInstalled: {
      invoke: {
        src: async () => {
          execSync("gh --version", {
            stdio: "ignore",
          });
        },
        onDone: {
          target: "checkingIfHasUnstagedChanges",
        },
        onError: {
          target: "#complete",
          actions: () => console.log("You must have GitHub CLI installed."),
        },
      },
    },
    checkingIfHasUnstagedChanges: {
      on: {
        HAS_NO_STAGED_CHANGES: {
          target: "#complete",
          actions: () => {
            console.error(
              "You have no staged changes. Cannot create a new branch.",
            );
          },
        },
        UNSTAGE_CHANGE_CHECK_COMPLETE: {
          target: "gettingCurrentBranch",
        },
      },
      invoke: {
        src: () => async (send) => {
          const hasStagedChanges =
            execSync(`git diff --cached`).toString().length > 0;

          if (!hasStagedChanges) {
            const { runGitAdd } = await prompts({
              name: "runGitAdd",
              type: "confirm",
              message:
                "You currently have no staged changes ready for commit. Would you like us to stage all changes?",
            });

            if (!runGitAdd) {
              return send("HAS_NO_STAGED_CHANGES");
            }

            exec(`git add .`);

            const hasStagedChangesAfterAdd =
              execSync(`git diff --cached`).toString().length > 0;

            if (!hasStagedChangesAfterAdd) {
              return send("HAS_NO_STAGED_CHANGES");
            }
          }

          return send("UNSTAGE_CHANGE_CHECK_COMPLETE");
        },
      },
    },
    gettingCurrentBranch: {
      always: {
        target: "checkingIfHasLinearIssueName",
        actions: assign((context, event) => {
          const branchName = execSync(
            "echo $(git symbolic-ref --short -q HEAD)",
          )
            .toString()
            .trim();

          return {
            currentBranch: branchName,
          };
        }),
      },
    },
    checkingIfHasLinearIssueName: {
      invoke: makePromptService(
        {
          name: "hasLinearName",
          type: "confirm",
          message: `Do you have a Linear issue you're working on?`,
        },
        {
          onDone: [
            {
              cond: (c, e) => Boolean(e.data.hasLinearName),
              target: "gettingIssueNameAndMessage.askingForIssueName",
            },
            {
              target: "gettingIssueNameAndMessage.askingForPrTitle",
            },
          ],
        },
      ),
    },
    gettingIssueNameAndMessage: {
      onDone: {
        target: "creatingAndPushingBranch",
      },
      states: {
        askingForIssueName: {
          invoke: makePromptService(
            {
              name: "linearIssueName",
              type: "text",
              message: `Paste in your linear issue name`,
            },
            {
              onDone: [
                {
                  cond: (ctx, e) => e.data.linearIssueName,
                  actions: assign((context, event) => {
                    return {
                      issueName: event.data.linearIssueName,
                    };
                  }),
                  target: "askingForPrTitle",
                },
                {
                  target: "#complete",
                },
              ],
            },
          ),
        },
        askingForPrTitle: {
          invoke: makePromptService(
            [
              {
                name: "title",
                type: "text",
                message: `What is the title of this PR?`,
              },
              {
                name: "isDraft",
                type: "confirm",
                message: "Is this PR a draft?",
              },
            ],
            {
              onDone: [
                {
                  cond: (ctx, e) => e.data.title,
                  actions: assign({
                    prTitle: (context, event) => {
                      return event.data.title;
                    },
                    issueName: (context, event) => {
                      if (context.issueName) return context.issueName;
                      return `matt/${fixBranchName(event.data.title)}`;
                    },
                    isDraft: (c, e) => Boolean(e.data.isDraft),
                  }),
                  target: "gettingDataComplete",
                },
                {
                  target: "#complete",
                },
              ],
            },
          ),
        },
        gettingDataComplete: {
          type: "final",
        },
      },
    },
    creatingAndPushingBranch: {
      invoke: {
        src: async (ctx) => {
          exec(`git checkout -b ${ctx.issueName}`);
          exec(`git commit -m \"${ctx.prTitle}\"`);
          exec(`git push -u origin ${ctx.issueName}`);
          exec(
            [
              "gh pr create",
              `--title \"${ctx.prTitle}\"`,
              ctx.isDraft ? "--draft" : "",
              `--base ${ctx.currentBranch}`,
            ].join(" "),
          );
        },
      },
      onDone: {
        target: "complete",
      },
    },
    complete: {
      id: "complete",
      type: "final",
    },
  },
});

export const pr = async () => {
  interpret(machine).start();
};
