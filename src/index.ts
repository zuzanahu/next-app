import { drizzle } from "drizzle-orm/mysql2";
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL

if (!connectionString)
{
    throw new Error("the .env variable DATABASE_URL is undefined")
} 

export const db = drizzle(connectionString);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!')

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!')

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!')
}

main();

