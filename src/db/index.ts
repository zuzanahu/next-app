import { drizzle } from "drizzle-orm/mysql2";
import { eq } from 'drizzle-orm';
import { User, usersTable } from './schema';
import 'dotenv/config';
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL

if (!connectionString)
{
    throw new Error("the .env variable DATABASE_URL is undefined")
} 

export const db = drizzle(connectionString, {
 schema,
 mode: 'default'
});

async function main() {
  const user: User = {
    name: 'John',
    age: 30,
    email: 'test@gmail.com',
    password: 'test123',
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

  //await db.delete(usersTable).where(eq(usersTable.email, user.email));
  //console.log('User deleted!')
}



 // Wrap the delete operation in a function
const deleteUsers = async () => {
  try {
      await db.delete(usersTable);
      console.log('User deleted!');
  } catch (error) {
      console.error('Error deleting users:', error);
  }
}

//adds one user or adds it and deletes it right away, depends if the deleting is commented out or not
//main();

// deletes all rows in user table
//deleteUsers();
