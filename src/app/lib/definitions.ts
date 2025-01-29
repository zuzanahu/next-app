import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().trim(),
});

export const CreateSubjectFormSchema = z.object({
  name: z.string(),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type CreateSubjectFormState =
  | {
      errors?: {
        name?: string[];
      };
      message?: string;
    }
  | undefined;
