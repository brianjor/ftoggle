import { pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projectsFeaturesEnvironments } from './featuresEnvironments';
import { projects } from './projects';

export const features = pgTable(
  'features',
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

export const featuresRelations = relations(features, ({ one, many }) => ({
  environments: many(projectsFeaturesEnvironments),
  project: one(projects, {
    fields: [features.projectId],
    references: [projects.id],
  }),
}));
