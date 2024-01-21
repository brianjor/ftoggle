import { pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projects } from '.';
import { featuresEnvironments } from './featuresEnvironments';

export const environments = pgTable(
  'environments',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    modifiedAt: timestamp('modified_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
  },
  (t) => ({
    unq: unique().on(t.name, t.projectId),
  }),
);

export const environmentRelations = relations(
  environments,
  ({ one, many }) => ({
    features: many(featuresEnvironments),
    project: one(projects, {
      fields: [environments.projectId],
      references: [projects.id],
    }),
  }),
);
