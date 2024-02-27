import { relations } from 'drizzle-orm';
import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { contextFields, environments, features, projects } from '.';

export const conditions = pgTable('conditions', {
  id: uuid('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  featureId: integer('feature_id')
    .notNull()
    .references(() => features.id, { onDelete: 'cascade' }),
  environmentId: integer('environment_id')
    .notNull()
    .references(() => environments.id, { onDelete: 'cascade' }),
  contextFieldId: uuid('context_field_id')
    .notNull()
    .references(() => contextFields.id, { onDelete: 'cascade' }),
  operator: text('operator').notNull(),
  description: text('description'),
  values: text('values').array().notNull(),
});

export const conditionsRealations = relations(conditions, ({ one }) => ({
  contextField: one(contextFields, {
    fields: [conditions.contextFieldId],
    references: [contextFields.id],
  }),
  environment: one(environments, {
    fields: [conditions.environmentId],
    references: [environments.id],
  }),
  feature: one(features, {
    fields: [conditions.featureId],
    references: [features.id],
  }),
  project: one(projects, {
    fields: [conditions.projectId],
    references: [projects.id],
  }),
}));
