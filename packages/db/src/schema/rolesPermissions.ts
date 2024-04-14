import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { tPermissions } from './permissions';
import { tRoles } from './roles';

export const tRolesPermissions = pgTable(
  'roles_permissions',
  {
    roleId: integer('role_id')
      .notNull()
      .references(() => tRoles.id),
    permissionId: integer('permission_id')
      .notNull()
      .references(() => tPermissions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  }),
);

export const tRolesPermissionsRelations = relations(
  tRolesPermissions,
  ({ one }) => ({
    role: one(tRoles, {
      fields: [tRolesPermissions.roleId],
      references: [tRoles.id],
    }),
    permission: one(tPermissions, {
      fields: [tRolesPermissions.permissionId],
      references: [tPermissions.id],
    }),
  }),
);
