import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { tUsersPasswords } from './usersPasswords';
import { tUsersRoles } from './usersRoles';

export const tUsers = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  isApproved: boolean('is_approved').notNull().default(false),
  githubId: integer('github_id').unique(),
});

export const tUsersRelations = relations(tUsers, ({ many, one }) => ({
  usersRoles: many(tUsersRoles),
  password: one(tUsersPasswords, {
    fields: [tUsers.id],
    references: [tUsersPasswords.userId],
  }),
}));
