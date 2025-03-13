import { db } from "@/db";
import { getLoggedInUserOrRedirect } from "@/utils/getLoggedInUserOrRedirect";
import { CreateListOfSubjects } from "@/components/CreateListOfSubjects";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany({
    with: { documents: true },
  });
  const currentUser = await getLoggedInUserOrRedirect();
  const canCreateDocuments = currentUser.role?.canCreateDocuments;

  return (
    <>
      <div className="container">
        <h1 className="mt-10 mb-5 text-2xl font-semibold">Předměty</h1>
      </div>
      <CreateListOfSubjects
        canCreateDocuments={canCreateDocuments}
        subjects={subjects}
      ></CreateListOfSubjects>
    </>
  );
}
