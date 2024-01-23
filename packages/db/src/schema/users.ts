import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { projectsUsers } from './projectsUsers';
import { usersRoles } from './usersRoles';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projectUsers: many(projectsUsers),
  usersRoles: many(usersRoles),
}));
