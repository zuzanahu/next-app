"use client";

import { useActionState, useEffect } from "react";
import { IconKey } from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  PasswordInput,
  Popover,
  PopoverDropdown,
  PopoverTarget,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { changeUserPasswordAction } from "@/server-actions/changeUserPasswordAction";

export type ChangeUserPasswordFormState = {
  password?: string;
  userId?: string;
  errors?: {
    password?: string[];
    userId?: string[];
  };
};

export function ChangeUserPasswordButton({ userId }: { userId: number }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [state, action, pending] = useActionState(
    changeUserPasswordAction,
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
        <ActionIcon
          loading={pending}
          variant="subtle"
          color="yellow"
          onClick={toggle}
        >
          <IconKey />
        </ActionIcon>
      </PopoverTarget>
      <PopoverDropdown>
        <form action={action} autoComplete="off">
          <input type="hidden" name="userId" value={userId} />
          <PasswordInput
            label="Heslo"
            placeholder="******"
            size="xs"
            autoComplete="off"
            name="password"
            withAsterisk
            error={
              state?.errors?.password && (
                <span>
                  <span>Password must:</span>
                  <span className="block pl-3 pt-1">
                    {state.errors.password.map((error) => (
                      <span key={error} className="list-item list-disc">
                        {error}
                      </span>
                    ))}
                  </span>
                </span>
              )
            }
          />
          <div className="flex gap-2 mt-5">
            <Button type="submit" size="xs" loading={pending}>
              Změnit heslo
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
