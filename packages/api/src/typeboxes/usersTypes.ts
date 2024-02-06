import { Static, t } from 'elysia';
import { rolesTableItem } from './rolesTypes';
import { usersRolesTableItem } from './usersRolesTypes';

/** DTO of a user from the `users` table. */
export const usersTableItem = t.Object({
  id: t.String(),
  username: t.String(),
});

/** DTO of a user from the `users` table. */
export type UsersTableItem = Static<typeof usersTableItem>;

/** DTO of a user with their roles. */
export const userWithRoles = t.Composite([
  usersTableItem,
  t.Object({
    usersRoles: t.Array(
      t.Composite([
        usersRolesTableItem,
        t.Object({
          role: rolesTableItem,
        }),
      ]),
    ),
  }),
]);

/** DTO of a user with their roles. */
export type UserWithRoles = Static<typeof userWithRoles>;
