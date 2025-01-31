import { getUserSession } from "@/lib/session";

export const getLoggedInUser = async () => {
  const session = await getUserSession();

  return session?.user;
};
