import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { tUsers } from './users';

export const tUsersSessions = pgTable('users_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => tUsers.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
