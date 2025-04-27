import { deleteSession } from "@/utils/deleteSession";
import { redirect } from "next/navigation";

export const GET = async () => {
  await deleteSession();

  redirect("/login");
};
