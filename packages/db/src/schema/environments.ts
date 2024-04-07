import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projects } from './projects';
import { projectsFeaturesEnvironments } from './projectsFeaturesEnvironments';

export const environments = pgTable(
  'environments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    modifiedAt: timestamp('modified_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    unq: unique().on(t.name, t.projectId),
  }),
);

export const environmentRelations = relations(
  environments,
  ({ one, many }) => ({
    features: many(projectsFeaturesEnvironments),
    project: one(projects, {
      fields: [environments.projectId],
      references: [projects.id],
    }),
  }),
);
