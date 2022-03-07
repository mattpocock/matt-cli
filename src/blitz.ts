import prompts from "prompts";
import "colors";

interface Task {
  name: string;
  defaultDone?: true;
  description?: string;
}

const tasks: Task[] = [
  {
    name: "Kitchen - Empty recycle bin",
  },
  {
    name: "Kitchen - Empty main bin",
  },
  {
    name: "Living Room - Empty cat poo",
  },
  {
    name: "Kitchen - Empty compost bin",
  },
  {
    name: "Kitchen - Clear sink of dry dishes",
  },
  {
    name: "Kitchen - Empty dishwasher",
  },
  {
    name: "Bedroom - Sort out dirty clothes",
  },
  {
    name: "Kitchen - Organise dirty plates on counter",
  },
  {
    name: "Kitchen - Make dinner",
  },
  {
    name: "Bathroom - Hang up washing",
  },
  {
    name: "Kitchen - Wash up dishes",
  },
  {
    name: "Kitchen - Clean hob",
    defaultDone: true,
  },
  {
    name: "Bathroom - Shave face",
  },
  {
    name: "Bathroom - Cut nails",
    defaultDone: true,
  },
  {
    name: "Outside - Put bins into street (Wednesdays)",
    defaultDone: true,
  },
  {
    name: "Living Room - Hoover downstairs",
    defaultDone: true,
  },
];

export const blitz = async () => {
  let tasksStillToDo = tasks
    .map((task) => task.name)
    .sort((a, b) => a.localeCompare(b));
  let roundsTaken = 0;
  while (tasksStillToDo.length > 0) {
    const result = await prompts({
      type: "multiselect",
      name: "tasksDone",
      message: "Which tasks have been done?",
      choices: tasksStillToDo.map((taskName) => {
        const taskConfig = tasks.find((task) => task.name === taskName);
        return {
          title: taskName,
          selected:
            roundsTaken === 0 ? taskConfig?.defaultDone ?? false : false,
          value: taskName,
          description: taskConfig?.description,
        };
      }),
    });

    if (!result.tasksDone) return;

    tasksStillToDo = tasksStillToDo.filter(
      (task) => !result.tasksDone.includes(task),
    );

    console.clear();

    displayStatus(
      tasks
        .map((task) => ({
          name: task.name,
          complete: !tasksStillToDo.includes(task.name),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );

    roundsTaken++;
  }
};

const displayStatus = (tasks: { name: string; complete: boolean }[]) => {
  tasks.forEach((task) => {
    const { name, complete } = task;
    const status = complete ? " PASS ".black.bgGreen : " FAIL ".black.bgRed;
    const adjustedName = `- ${name}`;
    console.log(
      `${status} ${complete ? adjustedName.green : adjustedName.red}`,
    );
  });
};
