import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { usersPasswords } from './usersPasswords';
import { usersRoles } from './usersRoles';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  isApproved: boolean('is_approved').notNull().default(false),
  githubId: integer('github_id').unique(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  usersRoles: many(usersRoles),
  password: one(usersPasswords, {
    fields: [users.id],
    references: [usersPasswords.userId],
  }),
}));
