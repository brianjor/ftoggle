import { dbClient } from '@ftoggle/db/connection';
import {
  permissions,
  roles,
  rolesPermissions,
  users,
  usersRoles,
} from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';
import { User } from 'lucia';
import { RecordDoesNotExistError } from '../errors/dbErrors';
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

export const getUserFromUsername = async (username: string) => {
  const user = await dbClient.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (user === undefined) {
    throw new RecordDoesNotExistError(
      `User with username: ${username} does not exist.`,
    );
  }
  return user;
};
