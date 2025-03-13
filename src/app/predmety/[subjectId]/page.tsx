import { db } from "@/db";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ subjectId: number }>;
}) {
  const subjectId = (await params).subjectId;
  console.log(await params);
  console.log(subjectId);
  const subject = await db.query.subjectsTable.findFirst({
    where: (subjectsTable, { eq }) => eq(subjectsTable.id, subjectId ?? ""),
    with: {
      documents: true,
    },
  });
  return (
    <>
      <h1>My Page {subject?.name} YEAH</h1>
      <ul>
        {subject?.documents.map((document) => {
          const time = document.createdAt.toLocaleTimeString();
          const date = document.createdAt.toDateString();
          return (
            <li key={document.id}>
              <Link href={"/predmety/" + subjectId + "/" + document.id}>
                {date + " " + time}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
