import { db } from "@/db";
import * as schema from "@/db/schema";
import fs from "fs/promises";
import { glob } from "glob";

import { reset } from "drizzle-seed";
import path from "path";
await reset(db, schema);

function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

const [adminRole] = await db.insert(schema.userRoles).values({
  name: "Admin",
  canCreateDocuments: true,
  canDeleteDocuments: true,
  canViewUsers: true,
});

await db
  .insert(schema.subjectsTable)
  .values([
    { name: "Český jazyk" },
    { name: "Anglický jazyk" },
    { name: "Anglický jazyk 2" },
    { name: "Francouzský jazyk" },
    { name: "Fyzika" },
    { name: "Biologie" },
    { name: "Chemie" },
    { name: "Dějepis" },
    { name: "Zeměpis" },
    { name: "Tělesná výchova" },
    { name: "Japonský jazyk" },
    { name: "Matematika" },
  ]);
console.log("Subjects created!");

const subjects = await db.query.subjectsTable.findMany();
const subjectIds = subjects.map((subject) => subject.id);

const [adminUser] = await db.insert(schema.usersTable).values({
  name: "John",
  roleId: adminRole.insertId,
  email: "test@gmail.com",
  password: "test123",
});
console.log("New user created!");

const documentsToCreate = await glob("*.json", {
  cwd: path.join(process.cwd(), "scripts", "documents"),
  absolute: true,
});

await Promise.all(
  documentsToCreate.map(async (documentJsonPath, index) => {
    const documentJson = await fs.readFile(documentJsonPath, {
      encoding: "utf8",
    });
    const document = JSON.parse(documentJson);

    await db.insert(schema.documentsTable).values({
      isFinal: true,
      revisedAt: new Date(),
      createdAt: new Date(),
      subjectId: subjectIds[getRandomNumber(subjectIds.length - 1)],
      ownerId: adminUser.insertId,
      title: `Neznámý dokument (${index})`,
      ...document,
    });
  })
);

console.log("Documents created!");

process.exit();

// async function addSessions() {
//   const user = await db.query.usersTable.findFirst({
//     where: eq(usersTable.email, "test@gmail.com"),
//   });
//   if (user) {
//     const session: Session = {
//       //vyprsi 14:15
//       expiresAt: new Date(Date.now() + 3600000 * 3),
//       //id: 12
//       userId: user.id,
//       id: uuid(),
//     };
//     await db.insert(sessionsTable).values(session);
//     console.log("New session created!");

//     const sessions = await db.select().from(sessionsTable);
//     console.log("Getting all sessions from the database: ", sessions);
//   }
// }

// // Wrap the delete operation in a function
// const deleteDbs = async () => {
//   try {
//     await db.delete(sessionsTable);
//     console.log("sessions deleted!");
//     await db.delete(usersTable);
//     console.log("users deleted!");
//   } catch (error) {
//     console.error("Error deleting:", error);
//   }
// };

//adds one user or adds it and deletes it right away, depends if the deleting is commented out or not
//main();

// deletes all rows in user table
//deleteDbs();

//insertUsersAndUpdate()
//addSessions()
