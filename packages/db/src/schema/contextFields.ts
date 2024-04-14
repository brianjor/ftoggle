import { relations } from 'drizzle-orm';
import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';
import { tProjects } from './projects';

export const tContextFields = pgTable(
  'context_fields',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: text('project_id')
      .notNull()
      .references(() => tProjects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
  },
  (t) => ({
    unq: unique().on(t.projectId, t.name),
  }),
);

export const tContextFieldsRelations = relations(tContextFields, ({ one }) => ({
  project: one(tProjects, {
    fields: [tContextFields.projectId],
    references: [tProjects.id],
  }),
}));
