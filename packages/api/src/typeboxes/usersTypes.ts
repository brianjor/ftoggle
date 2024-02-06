import { Static, t } from 'elysia';

/** DTO of a user from the `users` table. */
export const usersTableItem = t.Object({
  id: t.String(),
  username: t.String(),
});

/** DTO of a user from the `users` table. */
export type UsersTableItem = Static<typeof usersTableItem>;
