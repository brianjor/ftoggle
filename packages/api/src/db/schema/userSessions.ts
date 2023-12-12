import { bigint, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userSessions = pgTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  activeExpires: bigint('active_expires', { mode: 'bigint' }).notNull(),
  idleExpires: bigint('idle_expires', { mode: 'bigint' }).notNull(),
});
