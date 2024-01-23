import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { environments } from './environments';
import { features } from './features';
import { projects } from './projects';

export const projectsFeaturesEnvironments = pgTable(
  'projects_features_environments',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id),
    featureId: integer('feature_id')
      .notNull()
      .references(() => features.id),
    environmentId: integer('environment_id')
      .notNull()
      .references(() => environments.id),
    isEnabled: boolean('is_enabled').notNull().default(false),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.featureId, t.environmentId, t.projectId] }),
  }),
);

export const featuresEnvironmentsRelations = relations(
  projectsFeaturesEnvironments,
  ({ one }) => ({
    feature: one(features, {
      fields: [projectsFeaturesEnvironments.featureId],
      references: [features.id],
    }),
    environment: one(environments, {
      fields: [projectsFeaturesEnvironments.environmentId],
      references: [environments.id],
    }),
    project: one(projects, {
      fields: [projectsFeaturesEnvironments.projectId],
      references: [projects.id],
    }),
  }),
);
