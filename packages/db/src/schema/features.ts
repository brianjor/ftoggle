import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const features = pgTable('features', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  modifiedAt: timestamp('modified_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
