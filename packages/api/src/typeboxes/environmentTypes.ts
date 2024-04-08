import { Static, t } from 'elysia';

/** DTO of an environment from the `environments` table. */
export const environmentsTableItem = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  modifiedAt: t.Date(),
  projectId: t.String(),
});

/** DTO of an environment from the `environments` table. */
export type EnvironmentsTableItem = Static<typeof environmentsTableItem>;
