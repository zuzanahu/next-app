import { relations, sql } from 'drizzle-orm';
import { int, mysqlTable, serial, varchar, longtext, datetime, boolean, bigint} from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  // Long text is due to long hashed password
  password:  longtext().notNull()
});

export type User = typeof usersTable.$inferInsert

export const sessionsTable = mysqlTable('sessions_table', {
  // v4 uuid is varchar, but converting it to binary takes up less space
  id: varchar({length: 36}).unique().primaryKey(),
  expiresAt: datetime("expires_at").notNull(),
  // Foreign key
  userId: bigint("user_id", { mode: 'number', unsigned: true }).notNull().references(() => usersTable.id),
});

export const sessionsTableRelations = relations(sessionsTable, ({one}) => ({user: one(usersTable, {fields: [sessionsTable.userId], references:[usersTable.id]})}))

export type Session = typeof sessionsTable.$inferInsert

export const subjectsTable = mysqlTable('subjects_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});

export type Subject = typeof subjectsTable.$inferInsert

export const documentsTable = mysqlTable('documents_table', {
  id: serial().primaryKey(),
  content: varchar({ length: 255 }),
  subjectId: bigint("subject_id", { mode: 'number', unsigned: true }).notNull().references(() => subjectsTable.id),
  ownerId: bigint("owner_id", { mode: 'number', unsigned: true }).notNull().references(() => usersTable.id),
  isFinal: boolean("is_final").notNull(),
  revisedAt: datetime("revised_at").notNull(),
  createdAt: datetime("created_at").notNull().default(sql`now()`),
});

export const documentsTableRelations = relations(documentsTable, ({one}) => (
  {
    subject: one(subjectsTable, {fields: [documentsTable.subjectId], references:[subjectsTable.id]}),
    owner: one(usersTable, {fields:[documentsTable.ownerId], references:[usersTable.id]}),
  }))

export type Document = typeof documentsTable.$inferInsert