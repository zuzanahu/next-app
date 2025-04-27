import { getUserFromSession } from "./getUserFromSession";

export const getLoggedInUser = async () => {
  const session = await getUserFromSession();

  return session?.user;
};
