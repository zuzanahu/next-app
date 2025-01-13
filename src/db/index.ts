import { drizzle } from "drizzle-orm/mysql2";
import { eq } from 'drizzle-orm';
import { User, usersTable, Session, sessionsTable } from './schema';
import 'dotenv/config';
import * as schema from "./schema"
import { v4 as uuid } from "uuid";

const connectionString = process.env.DATABASE_URL

if (!connectionString)
{
    throw new Error("the .env variable DATABASE_URL is undefined")
} 

export const db = drizzle(connectionString, {
 schema,
 mode: 'default'
});

async function insertUsersAndUpdate() {
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

async function addSessions() {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, "test@gmail.com"),
  });
  if (user) {
    const session: Session = {
    //vyprsi 14:15
    expires: new Date(Date.now() + 3600000*3),
    //id: 12
    user: user.id,
    id: uuid(),
    };
    await db.insert(sessionsTable).values(session);
    console.log('New session created!')

    const sessions = await db.select().from(sessionsTable);
    console.log('Getting all sessions from the database: ', sessions)
  }
}


 // Wrap the delete operation in a function
const deleteDbs = async () => {
  try {
      await db.delete(sessionsTable);
      console.log('sessions deleted!');
      await db.delete(usersTable);
      console.log('users deleted!');
  } catch (error) {
      console.error('Error deleting:', error);
  }
}

//adds one user or adds it and deletes it right away, depends if the deleting is commented out or not
//main();

// deletes all rows in user table
//deleteDbs();

//insertUsersAndUpdate()
//addSessions()