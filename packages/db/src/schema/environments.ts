import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { tProjects } from './projects';
import { tProjectsFeaturesEnvironments } from './projectsFeaturesEnvironments';

export const tEnvironments = pgTable(
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
      .references(() => tProjects.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    unq: unique().on(t.name, t.projectId),
  }),
);

export const tEnvironmentsRelations = relations(
  tEnvironments,
  ({ one, many }) => ({
    features: many(tProjectsFeaturesEnvironments),
    project: one(tProjects, {
      fields: [tEnvironments.projectId],
      references: [tProjects.id],
    }),
  }),
);
