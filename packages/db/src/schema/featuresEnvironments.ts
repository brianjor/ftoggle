import { boolean, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { environments } from './environments';
import { features } from './features';

export const featuresEnvironments = pgTable(
  'features_environments',
  {
    featureId: integer('feature_id')
      .notNull()
      .references(() => features.id),
    environmentId: integer('environment_id')
      .notNull()
      .references(() => environments.id),
    isEnabled: boolean('is_enabled').notNull().default(false),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.featureId, t.environmentId] }),
  }),
);

export const featuresEnvironmentsRelations = relations(
  featuresEnvironments,
  ({ one }) => ({
    feature: one(features, {
      fields: [featuresEnvironments.featureId],
      references: [features.id],
    }),
    environment: one(environments, {
      fields: [featuresEnvironments.environmentId],
      references: [environments.id],
    }),
  }),
);
