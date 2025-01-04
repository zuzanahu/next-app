import { int, mysqlTable, serial, varchar, longtext } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  // long text is due to long hashed password
  password:  longtext().notNull()
});

export type User = typeof usersTable.$inferInsert