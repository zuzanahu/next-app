import { ChangeSubjectForm } from "@/components/ChangeSubjectForm";
import { CreateSubjectButton } from "@/components/CreateSubjectButton";
import { DeleteSubjectButton } from "@/components/DeleteSubjectButton";
import { PageHeader } from "@/components/PageHeader";
import { db } from "@/db";
import { subjectsTable } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function Page() {
  const subjects = await db.query.subjectsTable.findMany({
    orderBy: desc(subjectsTable.id),
  });

  return (
    <>
      <PageHeader title="Předměty" afterTitleOutlet={<CreateSubjectButton />} />

      <div className="container space-y-2 divide-gray-100 divide-y-2">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex gap-3 items-end pb-5">
            <div className="rounded-md w-9 h-9 bg-blue-50 border-blue-400 border flex items-center justify-center flex-none">
              {subject.id}
            </div>
            <ChangeSubjectForm subject={subject} />
            <DeleteSubjectButton
              className="flex-none mb-0.5"
              subjectId={subject.id}
            />
          </div>
        ))}
      </div>
    </>
  );
}
