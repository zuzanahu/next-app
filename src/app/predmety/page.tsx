import { db } from "@/db";
import { getLoggedInUserOrRedirect } from "@/utils/getLoggedInUserOrRedirect";
import { ListOfSubjects } from "@/components/ListOfSubjects";
import { FinalizedDocuments } from "@/components/FinalizedDocuments";
import { PageHeader } from "@/components/PageHeader";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany({
    with: { documents: true },
  });
  const currentUser = await getLoggedInUserOrRedirect();
  const canCreateDocuments = currentUser.role?.canCreateDocuments;
  const canViewAdministration = currentUser.role?.canViewAdministration;
  const canDeleteDocuments = currentUser.role?.canDeleteDocuments;

  return (
    <>
      <PageHeader
        title="Předměty"
        afterTitleOutlet={canViewAdministration ? <FinalizedDocuments /> : null}
      />

      <ListOfSubjects
        canCreateDocuments={canCreateDocuments}
        canDeleteDocuments={canDeleteDocuments}
        subjects={subjects}
      ></ListOfSubjects>
    </>
  );
}
