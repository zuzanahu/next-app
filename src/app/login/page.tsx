"use client";

import { login } from "@/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form className="container text-xl mt-10" action={action}>
      <div>
        <label htmlFor="email" className="mr-5">
          Email
        </label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      {state?.errors?.email && (
        <small className="text-red-600">{state.errors.email}</small>
      )}
      <div>
        <label htmlFor="password" className="mr-5">
          Password
        </label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <small className="text-red-600">{state.errors.password}</small>
      )}
      <button
        className="mt-2 px-4 py-1 bg-green-600 focus:ring-2 rounded-md text-sm text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
      >
        {pending ? "Submitting..." : "Sign In"}
      </button>
    </form>
  );
}
