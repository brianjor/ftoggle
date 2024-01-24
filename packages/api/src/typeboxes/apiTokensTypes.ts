import { Static, t } from 'elysia';

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
