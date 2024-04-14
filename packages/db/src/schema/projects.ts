import { boolean, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { tApiTokens } from '.';
import { tConditions } from './conditions';
import { tContextFields } from './contextFields';
import { tEnvironments } from './environments';
import { tFeatures } from './features';

export const tProjects = pgTable(
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

export const tProjectsRelations = relations(tProjects, ({ many }) => ({
  environments: many(tEnvironments),
  features: many(tFeatures),
  apiTokens: many(tApiTokens),
  contextFields: many(tContextFields),
  conditions: many(tConditions),
}));
