"use client";

import { doLoginAction } from "@/server-actions/doLoginAction";
import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useActionState } from "react";

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export default function LoginPage() {
  const [state, action, pending] = useActionState(doLoginAction, undefined);

  return (
    <form className="container text-xl mt-10 max-w-sm" action={action}>
      <Group justify="space-between">
        <Text component="label" htmlFor="email" size="sm" fw={500}>
          Email
        </Text>
      </Group>
      <TextInput
        placeholder="Váš email"
        name="email"
        id="email"
        type="email"
        error={state?.errors?.email}
      />
      <Group justify="space-between" className="mt-5">
        <Text component="label" htmlFor="password" size="sm" fw={500}>
          Vaše heslo
        </Text>
      </Group>
      <PasswordInput
        placeholder="Vaše heslo"
        name="password"
        id="password"
        error={state?.errors?.password}
      />
      <Button loading={pending} type="submit" className="mt-5">
        {pending ? "Přihlašuji..." : "Přihlásit se"}
      </Button>
    </form>
  );
}
