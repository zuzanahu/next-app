import { z } from "zod";

export const createSubjectFormSchema = z.object({
  name: z.string(),
});
