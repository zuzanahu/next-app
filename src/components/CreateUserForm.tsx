"use client";
import type { UserRole } from "@/db/schema";
import { createUserAction } from "@/server-actions/createUserAction";
import {
  Button,
  Group,
  PasswordInput,
  Radio,
  RadioGroup,
  TextInput,
} from "@mantine/core";
import { useActionState } from "react";

export type CreateUserFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export function CreateUserForm({ roles }: { roles: UserRole[] }) {
  const [state, action, pending] = useActionState(createUserAction, undefined);

  return (
    <form action={action} autoComplete="off">
      <TextInput
        label="Jméno"
        placeholder="Jméno"
        size="xs"
        name="name"
        withAsterisk
        error={state?.errors?.name}
        defaultValue={state?.inputData.name?.toString() ?? ""}
      />
      <TextInput
        label="Email"
        placeholder="john@doe.com"
        size="xs"
        mt="xs"
        name="email"
        withAsterisk
        error={state?.errors?.email}
        defaultValue={state?.inputData.email?.toString() ?? ""}
      />
      <RadioGroup
        mt="xs"
        size="xs"
        name="roleId"
        label="Uživatelská role"
        error={state?.errors.roleId}
        errorProps={{
          className: "!mt-2",
        }}
        withAsterisk
        defaultValue={state?.inputData.roleId?.toString()}
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
      <PasswordInput
        label="Heslo"
        placeholder="******"
        size="xs"
        mt="xs"
        autoComplete="off"
        name="password"
        withAsterisk
        defaultValue={state?.inputData.password?.toString() ?? ""}
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

      <Button type="submit" size="xs" loading={pending} className="mt-5">
        Vytvořit uživatele
      </Button>
    </form>
  );
}
