import {
  boolean,
  integer,
  pgTable,
  text,
  unique,
  uuid,
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
      .references(() => projects.id, { onDelete: 'cascade' }),
    featureId: uuid('feature_id')
      .notNull()
      .references(() => features.id, { onDelete: 'cascade' }),
    environmentId: integer('environment_id')
      .notNull()
      .references(() => environments.id, { onDelete: 'cascade' }),
    isEnabled: boolean('is_enabled').notNull().default(false),
  },
  (t) => ({
    unq: unique().on(t.featureId, t.environmentId, t.projectId),
  }),
);

export const projectFeaturesEnvironmentsRelations = relations(
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
