import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const usersPasswords = pgTable('users_passwords', {
  id: serial('id').primaryKey(),
  hashedPassword: text('hashed_password').notNull(),
  userId: text('user_id')
    .unique()
    .notNull()
    .references(() => users.id),
});

export const passwordTableRelations = relations(usersPasswords, ({ one }) => ({
  user: one(users, {
    fields: [usersPasswords.userId],
    references: [users.id],
  }),
}));
