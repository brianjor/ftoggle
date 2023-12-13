import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 15 }).primaryKey(),
  username: varchar('username', { length: 30 }).unique().notNull(),
});
