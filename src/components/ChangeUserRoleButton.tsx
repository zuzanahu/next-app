"use client";

import { useActionState, useEffect } from "react";
import { IconUserCheck } from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Radio,
  RadioGroup,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { UserRole } from "@/db/schema";
import { changeUserRoleAction } from "@/server-actions/changeUserRoleAction";

export type ChangeUserPasswordFormState = {
  roleId?: string;
  userId?: string;
  errors?: {
    roleId?: string[];
    userId?: string[];
  };
};

export function ChangeUserRoleButton({
  userId,
  roles,
}: {
  userId: number;
  roles: UserRole[];
}) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [state, action, pending] = useActionState(
    changeUserRoleAction,
    undefined
  );

  useEffect(() => {
    if (state?.shouldClose) {
      close();
    }
    // this has to be this way. we dont want to react to anything else or it wont work correctly (password window wont open again)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Popover
      opened={opened}
      width={300}
      trapFocus
      position="bottom-end"
      withArrow
      shadow="md"
    >
      <PopoverTarget>
        <ActionIcon loading={pending} variant="subtle" onClick={toggle}>
          <IconUserCheck />
        </ActionIcon>
      </PopoverTarget>
      <PopoverDropdown>
        <form action={action} autoComplete="off">
          <input type="hidden" name="userId" value={userId} />
          <RadioGroup
            size="xs"
            name="roleId"
            label="Uživatelská role"
            error={state?.errors?.roleId}
            errorProps={{
              className: "!mt-2",
            }}
            withAsterisk
          >
            <Group mt={5}>
              {roles.map(({ id, name }) => (
                <Radio
                  key={id}
                  value={String(id)}
                  label={name}
                  name="roleId"
                  size="xs"
                />
              ))}
            </Group>
          </RadioGroup>
          <div className="flex gap-2 mt-5">
            <Button type="submit" size="xs" loading={pending}>
              Změnit roly
            </Button>
            <Button
              type="button"
              size="xs"
              disabled={pending}
              color="gray"
              variant="subtle"
              onClick={close}
            >
              Zrušit
            </Button>
          </div>
        </form>
      </PopoverDropdown>
    </Popover>
  );
}
