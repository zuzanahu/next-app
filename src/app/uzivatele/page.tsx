import { CreateUserForm } from "@/components/CreateUserForm";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { db } from "@/db";

export default async function UsersPage() {
  const users = await db.query.usersTable.findMany();

  return (
    <>
      <h1>Uživatelé</h1>
      <p>Přidat uživatele</p>
      <CreateUserForm />
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
    </>
  );
}
