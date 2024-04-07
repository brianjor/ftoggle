import { Static, t } from 'elysia';
import { environmentsTableItem } from './environmentTypes';
import { featuresEnvironmentsTableItem } from './featuresEnvironmentsTypes';

/** DTO of a feature from the `features` table. */
export const featuresTableItem = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  modifiedAt: t.Date(),
  projectId: t.String(),
});

/** DTO of a feature from the `features` table. */
export type FeaturesTableItem = Static<typeof featuresTableItem>;

/** DTO of a feature with environments. */
export const featureWithEnvironments = t.Composite([
  featuresTableItem,
  t.Object({
    environments: t.Array(
      t.Composite([
        featuresEnvironmentsTableItem,
        t.Object({
          environment: environmentsTableItem,
        }),
      ]),
    ),
  }),
]);

/** DTO of a feature with environments. */
export type FeatureWithEnvironments = Static<typeof featureWithEnvironments>;
