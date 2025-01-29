import { db } from "@/db";
import { CreateDocumentButton } from "../components/CreateDocumentButton";
import Link from "next/link";
import RootLayout from "../layout";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany();

  return (
    <RootLayout>
      <ul>
        {subjects ? (
          subjects.map((subject) => {
            return (
              <li key={subject.id}>
                {subject.name}
                <CreateDocumentButton subjectId={subject.id} />
                <Link href={"/subjects/" + subject.id}>Show all documents</Link>
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
