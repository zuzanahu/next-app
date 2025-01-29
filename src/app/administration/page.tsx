import { db } from "@/db";
import Link from "next/link";
import RootLayout from "../layout";
import { CreateSubjectForm } from "../components/CreateSubjectButton";
import { DeleteSubjectButton } from "../components/DeleteSubjectButton";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany();

  return (
    <RootLayout>
      <h2>Předměty</h2>
      <CreateSubjectForm></CreateSubjectForm>
      <ul>
        {subjects ? (
          subjects.map((subject) => {
            return (
              <li key={subject.id}>
                {subject.name}
                <DeleteSubjectButton subjectId={subject.id} />
                <Link href={"/home/" + subject.id}>Show all documents</Link>
              </li>
            );
          })
        ) : (
          <small>There are no subjets yet</small>
        )}
      </ul>
    </RootLayout>
  );
}
