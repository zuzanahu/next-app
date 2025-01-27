import { db } from "@/db";
import {CreateDocumentButton} from "../components/CreateDocumentButton";
import Link from "next/link";

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
              <Link href={"/home/" + subject.id}>Show all documents</Link>
            </li>
          );
        })
      ) : (
        <small>There are no subjets yet</small>
      )}
    </ul>
  );
}
