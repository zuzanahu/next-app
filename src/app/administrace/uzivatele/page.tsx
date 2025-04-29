import { AddUserButton } from "@/components/AddUserButton";
import { ChangeUserPasswordButton } from "@/components/ChangeUserPasswordButton";
import { ChangeUserRoleButton } from "@/components/ChangeUserRoleButton";
import { DeleteUserButton } from "@/components/DeleteUserButton";
import { PageHeader } from "@/components/PageHeader";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { assertDefined } from "@/utils/assertDefined";
import { getLoggedInUser } from "@/utils/getLoggedInUser";
import {
  Group,
  ScrollArea,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Tooltip,
} from "@mantine/core";
import { eq, not } from "drizzle-orm";

const actionsColumnWidth = 120;

export default async function UsersPage() {
  const loggedInUser = assertDefined(await getLoggedInUser());
  const userRoles = await db.query.userRoles.findMany();
  const users = await db.query.usersTable.findMany({
    with: {
      role: true,
    },
    // We will not allow current logged in users to edit themselves
    where: not(eq(usersTable.id, loggedInUser.id)),
  });

  const rows = users.map((user) => (
    <TableTr key={user.id}>
      <TableTd>
        <Group gap="sm">
          <Text size="sm" fw={500}>
            {user.name}
          </Text>
        </Group>
      </TableTd>
      <TableTd>{user.email}</TableTd>
      <TableTd>{user.role?.name ?? "Neznámá role"}</TableTd>
      <TableTd w={actionsColumnWidth}>
        <div className="flex gap-2">
          <Tooltip label="Změnit roly">
            {/* Without this div the tooltip wont find children in server components as ChangeUserRoleButton is client component only*/}
            <div>
              <ChangeUserRoleButton userId={user.id} roles={userRoles} />
            </div>
          </Tooltip>
          <Tooltip label="Změnit heslo">
            <div>
              <ChangeUserPasswordButton userId={user.id} />
            </div>
          </Tooltip>
          <Tooltip label="Vymazat">
            <div>
              <DeleteUserButton userId={user.id} />
            </div>
          </Tooltip>
        </div>
      </TableTd>
    </TableTr>
  ));

  return (
    <>
      <PageHeader title="Uživatelé" afterTitleOutlet={<AddUserButton />} />

      <div className="container">
        <ScrollArea>
          <Table miw={800} verticalSpacing="sm">
            <TableThead>
              <TableTr>
                <TableTh>Jméno</TableTh>
                <TableTh>Email</TableTh>
                <TableTh>Role</TableTh>
                <TableTh w={actionsColumnWidth} className="sr-only">
                  Akce
                </TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>{rows}</TableTbody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
}
