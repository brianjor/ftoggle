import { boolean, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { tEnvironments } from './environments';
import { tFeatures } from './features';
import { tProjects } from './projects';

export const tProjectsFeaturesEnvironments = pgTable(
  'projects_features_environments',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => tProjects.id, { onDelete: 'cascade' }),
    featureId: uuid('feature_id')
      .notNull()
      .references(() => tFeatures.id, { onDelete: 'cascade' }),
    environmentId: uuid('environment_id')
      .notNull()
      .references(() => tEnvironments.id, { onDelete: 'cascade' }),
    isEnabled: boolean('is_enabled').notNull().default(false),
  },
  (t) => ({
    unq: unique().on(t.featureId, t.environmentId, t.projectId),
  }),
);

export const tProjectFeaturesEnvironmentsRelations = relations(
  tProjectsFeaturesEnvironments,
  ({ one }) => ({
    feature: one(tFeatures, {
      fields: [tProjectsFeaturesEnvironments.featureId],
      references: [tFeatures.id],
    }),
    environment: one(tEnvironments, {
      fields: [tProjectsFeaturesEnvironments.environmentId],
      references: [tEnvironments.id],
    }),
    project: one(tProjects, {
      fields: [tProjectsFeaturesEnvironments.projectId],
      references: [tProjects.id],
    }),
  }),
);
