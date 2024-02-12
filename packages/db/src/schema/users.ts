import { relations } from 'drizzle-orm';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { projectsUsers } from './projectsUsers';
import { usersPasswords } from './usersPasswords';
import { usersRoles } from './usersRoles';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  isApproved: boolean('is_approved').notNull().default(false),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  projectUsers: many(projectsUsers),
  usersRoles: many(usersRoles),
  password: one(usersPasswords, {
    fields: [users.id],
    references: [usersPasswords.userId],
  }),
}));
