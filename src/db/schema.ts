import { int, mysqlTable, serial, varchar, longtext, datetime, bigint, varbinary } from 'drizzle-orm/mysql-core';

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
  expires: datetime().notNull(),
  // Foreign key
  user: bigint({ mode: 'number', unsigned: true }).references(() => usersTable.id).notNull(),
});

export type Session = typeof sessionsTable.$inferInsert