import { db } from "@/db";
import { getLoggedInUserOrRedirect } from "@/utils/getLoggedInUserOrRedirect";
import { ListOfSubjects } from "@/components/ListOfSubjects";
import { FinalizedDocuments } from "@/components/FinalizedDocuments";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany({
    with: { documents: true },
  });
  const currentUser = await getLoggedInUserOrRedirect();
  const canCreateDocuments = currentUser.role?.canCreateDocuments;
  const canViewAdministration = currentUser.role?.canViewAdministration;

  return (
    <>
      <div className="container">
        <h1 className="mt-10 mb-5 text-2xl font-semibold">Předměty</h1>
      </div>
      {canViewAdministration ? <FinalizedDocuments></FinalizedDocuments> : null}
      <ListOfSubjects
        canCreateDocuments={canCreateDocuments}
        subjects={subjects}
      ></ListOfSubjects>
    </>
  );
}
