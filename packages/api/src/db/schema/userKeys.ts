import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userKeys = pgTable('user_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  hashedPassword: text('hashed_password'),
});
