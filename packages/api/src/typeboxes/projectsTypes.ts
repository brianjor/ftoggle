import { Static, t } from 'elysia';
import { environmentsTableItem } from './environmentTypes';
import { featureWithEnvironments } from './featuresTypes';

/** DTO of a project from the `projects` table. */
export const projectTableItem = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  modifiedAt: t.Date(),
  isArchived: t.Boolean(),
});

/** DTO of a project from the `projects` table. */
export type ProjectTableItem = Static<typeof projectTableItem>;

/** DTO of a project with features and environments. */
export const projectWithFeaturesAndEnvironments = t.Composite([
  projectTableItem,
  t.Object({
    features: t.Array(featureWithEnvironments),
    environments: t.Array(environmentsTableItem),
  }),
]);

/** DTO of a project with features and environments. */
export type ProjectWithFeaturesAndEnvironments = Static<
  typeof projectWithFeaturesAndEnvironments
>;
