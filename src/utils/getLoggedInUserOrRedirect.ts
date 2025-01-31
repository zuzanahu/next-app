import { getUserSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "./getLoggedInUser";

export const getLoggedInUserOrRedirect = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  return user;
};
