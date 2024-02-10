import { Static, t } from 'elysia';
import { rolesTableItem } from './rolesTypes';

/** DTO of a users roles relation, from the table `users_roles` */
export const usersRolesTableItem = t.Object({
  roleId: t.Number(),
  userId: t.String(),
});

/** DTO of a users roles relation, from the table `users_roles` */
export type UsersRolesTableItem = Static<typeof usersRolesTableItem>;

/** A users roles relation with the role */
export const usersRolesWithRole = t.Composite([
  usersRolesTableItem,
  t.Object({
    role: rolesTableItem,
  }),
]);

/** A users roles relation with the role */
export type UsersRolesWithRole = Static<typeof usersRolesWithRole>;
