import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userKeys = pgTable('user_keys', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 15 })
    .references(() => users.id)
    .notNull(),
  hashedPassword: varchar('hashed_password', { length: 255 }),
});
