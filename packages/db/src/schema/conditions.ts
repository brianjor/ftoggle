import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { tContextFields, tEnvironments, tFeatures, tProjects } from '.';

export const tConditions = pgTable('conditions', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: text('project_id')
    .notNull()
    .references(() => tProjects.id, { onDelete: 'cascade' }),
  featureId: uuid('feature_id')
    .notNull()
    .references(() => tFeatures.id, { onDelete: 'cascade' }),
  environmentId: uuid('environment_id')
    .notNull()
    .references(() => tEnvironments.id, { onDelete: 'cascade' }),
  contextFieldId: uuid('context_field_id')
    .notNull()
    .references(() => tContextFields.id, { onDelete: 'cascade' }),
  operator: text('operator').notNull(),
  description: text('description'),
  values: text('values').array().notNull(),
});

export const tConditionsRelations = relations(tConditions, ({ one }) => ({
  contextField: one(tContextFields, {
    fields: [tConditions.contextFieldId],
    references: [tContextFields.id],
  }),
  environment: one(tEnvironments, {
    fields: [tConditions.environmentId],
    references: [tEnvironments.id],
  }),
  feature: one(tFeatures, {
    fields: [tConditions.featureId],
    references: [tFeatures.id],
  }),
  project: one(tProjects, {
    fields: [tConditions.projectId],
    references: [tProjects.id],
  }),
}));
