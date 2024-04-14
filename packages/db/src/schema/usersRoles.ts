import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { tRoles } from './roles';
import { tUsers } from './users';

export const tUsersRoles = pgTable(
  'users_roles',
  {
    roleId: integer('role_id')
      .notNull()
      .references(() => tRoles.id),
    userId: text('user_id')
      .notNull()
      .references(() => tUsers.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.userId] }),
  }),
);

export const tUsersRolesRelations = relations(tUsersRoles, ({ one }) => ({
  role: one(tRoles, {
    fields: [tUsersRoles.roleId],
    references: [tRoles.id],
  }),
  user: one(tUsers, {
    fields: [tUsersRoles.userId],
    references: [tUsers.id],
  }),
}));
