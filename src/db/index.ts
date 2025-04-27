import { drizzle } from "drizzle-orm/mysql2";
// This is here mostly for seeding, Next.js does dotenv byitself
import "dotenv/config";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("the .env variable DATABASE_URL is undefined");
}

export const db = drizzle(connectionString, {
  schema,
  mode: "default",
});
