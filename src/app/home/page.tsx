"use server";
import CreateDocumentButton from "@/app/components/createDocumentButton";
import { db } from "@/db";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany();

  return (
    //create a list of subjects
    <ul>
      {subjects ? (
        subjects.map((subject) => {
          return (
            <li key={subject.id}>
              {subject.name}
              <CreateDocumentButton subjectId={subject.id} />
            </li>
          );
        })
      ) : (
        <small>There are no subjets yet</small>
      )}
    </ul>
  );
}
