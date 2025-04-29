import { SALT_ROUNDS } from "@/constants";
import bcrypt from "bcrypt";

export const hashPassword = async (input: string) => {
  // Create unique salt for each password
  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  // Return hashed password
  return bcrypt.hash(input, salt);
};
