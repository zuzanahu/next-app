import { db } from "@/db";
import Link from "next/link";
import { CreateSubjectForm } from "@/components/CreateSubjectForm";
import { DeleteSubjectButton } from "@/components/DeleteSubjectButton";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { CreateUserForm } from "@/components/CreateUserForm";

export default async function HomePage() {
  const subjects = await db.query.subjectsTable.findMany();
  const users = await db.query.usersTable.findMany();

  return (
    <>
      <h2>Předměty</h2>
      <ul>
        {subjects ? (
          subjects.map((subject) => {
            return (
              <li key={subject.id}>
                {subject.name}
                <DeleteSubjectButton subjectId={subject.id} />
                <Link href={"/subjects/" + subject.id}>
                  Přejít na dokumenty
                </Link>
              </li>
            );
          })
        ) : (
          <small>Ještě nejsou vytvořené žádné předměty</small>
        )}
      </ul>
      <h3>Přidat předmět</h3>
      <CreateSubjectForm></CreateSubjectForm>
      <h2>Uživatelé</h2>
      <ul>
        {users.map((user) => {
          return (
            <li key={user.id}>
              {user.name}
              <DeleteUserButton userId={user.id} />
            </li>
          );
        })}
      </ul>
      <h3>Přidat uživatele</h3>
      <CreateUserForm></CreateUserForm>
    </>
  );
}
