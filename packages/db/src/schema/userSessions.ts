import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const usersSessions = pgTable('users_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
