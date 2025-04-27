import { db } from "@/db";
import {
  sessionsTable,
  usersTable,
  type Session,
  type User,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

async function insertUsersAndUpdate() {
  const user: User = {
    name: "John",
    id: 1,
    roleId: 1,
    email: "test@gmail.com",
    password: "test123",
  };
  await db.insert(usersTable).values(user);
  console.log("New user created!");

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
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
      email: "test@example.com",
    })
    .where(eq(usersTable.email, user.email));
  console.log("User info updated!");

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
      expiresAt: new Date(Date.now() + 3600000 * 3),
      //id: 12
      userId: user.id,
      id: uuid(),
    };
    await db.insert(sessionsTable).values(session);
    console.log("New session created!");

    const sessions = await db.select().from(sessionsTable);
    console.log("Getting all sessions from the database: ", sessions);
  }
}

// Wrap the delete operation in a function
const deleteDbs = async () => {
  try {
    await db.delete(sessionsTable);
    console.log("sessions deleted!");
    await db.delete(usersTable);
    console.log("users deleted!");
  } catch (error) {
    console.error("Error deleting:", error);
  }
};

//adds one user or adds it and deletes it right away, depends if the deleting is commented out or not
//main();

// deletes all rows in user table
//deleteDbs();

//insertUsersAndUpdate()
//addSessions()
