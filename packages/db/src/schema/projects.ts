import { boolean, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { apiTokens } from '.';
import { environments } from './environments';
import { features } from './features';

export const projects = pgTable(
  'projects',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    modifiedAt: timestamp('modified_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    isArchived: boolean('is_archived').notNull().default(false),
  },
  (t) => ({
    unq: unique().on(t.id, t.name),
  }),
);

export const projectsRelations = relations(projects, ({ many }) => ({
  environments: many(environments),
  features: many(features),
  apiTokens: many(apiTokens),
}));
