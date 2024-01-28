import { Static, t } from 'elysia';
import { environmentsTableItem } from './environmentTypes';
import { projectTableItem } from './projectsTypes';

/** DTO of an api token from the `api_tokens` table. */
export const apiTokensTableItem = t.Object({
  id: t.String(),
  projectId: t.String(),
  environmentId: t.Number(),
  name: t.String(),
  type: t.String(),
  createdAt: t.Date(),
  userId: t.String(),
});

/** DTO of an api token from the `api_tokens` table. */
export type ApiTokensTableItem = Static<typeof apiTokensTableItem>;

/** DTO of an api token with related project and environment */
export const apiTokenWithProjectAndEnvironment = t.Composite([
  apiTokensTableItem,
  t.Object({
    project: projectTableItem,
    environment: environmentsTableItem,
  }),
]);

/** DTO of an api token with related project and environment */
export type ApiTokenWithProjectAndEnvironment = Static<
  typeof apiTokenWithProjectAndEnvironment
>;
