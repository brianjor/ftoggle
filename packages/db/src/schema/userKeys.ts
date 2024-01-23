import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const usersKeys = pgTable('users_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  hashedPassword: text('hashed_password'),
});
