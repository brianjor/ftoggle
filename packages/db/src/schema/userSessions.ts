import { bigint, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const usersSessions = pgTable('users_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
  idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
});
