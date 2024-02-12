import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { users } from './users';

export const usersRoles = pgTable(
  'users_roles',
  {
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.userId] }),
  }),
);

export const usersRolesRelations = relations(usersRoles, ({ one }) => ({
  role: one(roles, {
    fields: [usersRoles.roleId],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [usersRoles.userId],
    references: [users.id],
  }),
}));
