import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { usersRoles } from './usersRoles';

export const users = pgTable('users', {
  id: varchar('id', { length: 15 }).primaryKey(),
  username: varchar('username', { length: 30 }).unique().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersRoles: many(usersRoles),
}));
