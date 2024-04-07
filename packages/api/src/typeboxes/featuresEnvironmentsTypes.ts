import { Static, t } from 'elysia';

/** DTO of a features<->environments relation from the `features_environments` table. */
export const featuresEnvironmentsTableItem = t.Object({
  projectId: t.String(),
  featureId: t.String(),
  environmentId: t.Number(),
  isEnabled: t.Boolean(),
});

/** DTO of a features<->environments relation from the `features_environments` table. */
export type FeaturesEnvironmentsTableItem = Static<
  typeof featuresEnvironmentsTableItem
>;
