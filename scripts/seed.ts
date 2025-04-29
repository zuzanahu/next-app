import { db } from "@/db";
import * as schema from "@/db/schema";
import fs from "fs/promises";
import { glob } from "glob";

import { reset } from "drizzle-seed";
import path from "path";
import { hashPassword } from "@/utils/hashPassword";
await reset(db, schema);

function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

const [adminRole] = await db.insert(schema.userRoles).values({
  name: "Admin",
  canCreateDocuments: true,
  canDeleteDocuments: true,
  canViewAdministration: true,
});

const [userRole] = await db.insert(schema.userRoles).values({
  name: "User",
  canCreateDocuments: true,
  canDeleteDocuments: false,
  canViewAdministration: false,
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

const users = await db.query.usersTable.findMany();
const userIds = users.map((document) => document.id);

await db.insert(schema.usersTable).values({
  name: "John",
  roleId: adminRole.insertId,
  email: "admin@gmail.com",
  password: await hashPassword("test123"),
});

console.log("New admin created!");

await db.insert(schema.usersTable).values({
  name: "Alice Nováková",
  roleId: userRole.insertId,
  email: "user@gmail.com",
  password: await hashPassword("test321"),
});

console.log("New user created!");

// use glob package to find all documents with the .json extension
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
      subjectId: subjectIds.at(getRandomNumber(subjectIds.length - 1)),
      ownerId: userIds.at(getRandomNumber(userIds.length - 1)),
      title: `Neznámý dokument (${index})`,
      ...document,
    });
  })
);

console.log("Documents created!");

process.exit();
