import { dbClient } from '@ftoggle/db/connection';
import {
  users,
  permissions,
  usersRoles,
  roles,
  rolesPermissions,
} from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';
import { User } from 'lucia';
import { notNull } from '../helpers/filtering';

export const getUserPermissions = async (user: User) => {
  return (
    await dbClient
      .select({ permission: permissions.name })
      .from(users)
      .leftJoin(usersRoles, eq(users.id, usersRoles.userId))
      .leftJoin(roles, eq(usersRoles.roleId, roles.id))
      .leftJoin(rolesPermissions, eq(roles.id, rolesPermissions.roleId))
      .leftJoin(permissions, eq(rolesPermissions.permissionId, permissions.id))
      .where(eq(users.id, user.userId))
  )
    .map((r) => r.permission)
    .filter(notNull);
};
