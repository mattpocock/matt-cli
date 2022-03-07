import prompts from "prompts";
import colors from "colors";

const DISPLAY_LENGTH = process.stdout.columns;

interface Goal {
  goalNumber: number;
  name: string;
}

const MY_GOALS: Goal[] = [
  {
    goalNumber: 100,
    name: "Number of TypeScript tips planned",
  },
  {
    name: "Number of TypeScript tips queued",
    goalNumber: 100,
  },
  {
    goalNumber: 10000,
    name: "Current Twitter Followers",
  },
  {
    goalNumber: 5,
    name: "Conference appearances queued",
  },
];

export const goals = async () => {
  const countToGoal: Record<string, number> = {};

  for (const goal of MY_GOALS) {
    const { count } = await prompts({
      name: "count",
      message: `What's the progress on "${goal.name}"?`,
      type: "number",
    });

    countToGoal[goal.name] = count;
  }

  for (const goal of MY_GOALS) {
    const count = countToGoal[goal.name];
    const segmentsComplete = Math.round(
      (count / goal.goalNumber) * DISPLAY_LENGTH,
    );

    const segmentsNotComplete = DISPLAY_LENGTH - segmentsComplete;

    const isGoalComplete = count >= goal.goalNumber;

    const completeText = `${goal.name}: ${count}/${goal.goalNumber}`;

    console.log();
    console.log(isGoalComplete ? completeText.green : completeText.red);
    console.log(
      `${new Array(segmentsComplete).fill(" ").join("").bgGreen}${
        new Array(segmentsNotComplete).fill(" ").join("").bgRed
      }`,
    );
  }
};
