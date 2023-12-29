import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projects } from '.';
import { featuresEnvironments } from './featuresEnvironments';

export const environments = pgTable('environments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  modifiedAt: timestamp('modified_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  projectId: integer('project_id').references(() => projects.id),
});

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
