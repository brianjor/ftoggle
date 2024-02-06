import { Static, t } from 'elysia';

/** DTO of a role from the `roles` table */
export const rolesTableItem = t.Object({
  id: t.Number(),
  name: t.String(),
  description: t.Nullable(t.String()),
});

/** DTO of a role from the `roles` table */
export type RolesTableItem = Static<typeof rolesTableItem>;
