import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tUsers } from './users';

export const tUsersPasswords = pgTable('users_passwords', {
  id: serial('id').primaryKey(),
  hashedPassword: text('hashed_password').notNull(),
  userId: text('user_id')
    .unique()
    .notNull()
    .references(() => tUsers.id),
});

export const passwordTableRelations = relations(tUsersPasswords, ({ one }) => ({
  user: one(tUsers, {
    fields: [tUsersPasswords.userId],
    references: [tUsers.id],
  }),
}));
