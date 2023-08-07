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

  if (!result.arg) {
    process.exit(0);
  }

  return result.arg;
};
