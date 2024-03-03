import { relations } from 'drizzle-orm';
import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const contextFields = pgTable(
  'context_fields',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
  },
  (t) => ({
    unq: unique().on(t.projectId, t.name),
  }),
);

export const contextFieldsRelations = relations(contextFields, ({ one }) => ({
  project: one(projects, {
    fields: [contextFields.projectId],
    references: [projects.id],
  }),
}));
