import { Button, Popover, PopoverDropdown, PopoverTarget } from "@mantine/core";
import { CreateUserForm } from "./CreateUserForm";
import { db } from "@/db";

export async function AddUserButton() {
  const userRoles = await db.query.userRoles.findMany();

  return (
    <Popover width={300} trapFocus position="bottom-end" withArrow shadow="md">
      <PopoverTarget>
        <Button>Přidat uživatele</Button>
      </PopoverTarget>
      <PopoverDropdown>
        <CreateUserForm roles={userRoles} />
      </PopoverDropdown>
    </Popover>
  );
}
