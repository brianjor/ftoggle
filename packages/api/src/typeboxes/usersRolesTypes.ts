import { Static, t } from 'elysia';

export const usersRolesTableItem = t.Object({
  roleId: t.Number(),
  userId: t.String(),
});

export type UsersRolesTableItem = Static<typeof usersRolesTableItem>;
