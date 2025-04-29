// It checks for input to be anything other than null or undefined, othervise it throws
export const assertDefined = <T>(
  input: T,
  message = "Input cannot be null or undefined"
): NonNullable<T> => {
  if (input === null || input === undefined) {
    throw new Error(message);
  }

  return input;
};
