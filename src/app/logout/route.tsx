import { deleteSession } from "@/utils/deleteSession";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const GET = async () => {
  await deleteSession();

  // Flush cache just to be sure
  revalidatePath("/administrace/predmety");
  revalidatePath("/administrace/uzivatele");
  revalidatePath("/predmety");

  redirect("/login");
};
