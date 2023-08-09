import prompts from "prompts";

export const arg = async (opts: {
  message: string;
  initial?: string;
}): Promise<string> => {
  const result = await prompts({
    type: "text",
    message: opts.message,
    initial: opts.initial,
    name: "arg",
  });

  if ([null, undefined].includes(result.arg)) {
    process.exit(0);
  }

  return result.arg;
};

export const choose = async (opts: {
  message: string;
  choices: string[];
}): Promise<string> => {
  const result = await prompts({
    type: "autocomplete",
    choices: opts.choices.map((choice) => ({ title: choice, value: choice })),
    message: opts.message,
    name: "arg",
  });

  if (!result.arg) {
    process.exit(0);
  }

  return result.arg;
};
