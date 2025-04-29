import bcrypt from "bcrypt";

export const isPasswordValid = ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) => bcrypt.compare(password, hashedPassword);
