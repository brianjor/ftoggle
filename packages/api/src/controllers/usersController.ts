import { dbClient } from '@ftoggle/db/connection';
import {
  permissions,
  roles,
  rolesPermissions,
  users,
  usersRoles,
} from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { User } from 'lucia';
import { UserRole } from '../enums/roles';
import {
  DuplicateRecordError,
  RecordDoesNotExistError,
} from '../errors/dbErrors';
import { notNull } from '../helpers/filtering';
import { RolesController } from './rolesController';

const rolesController = new RolesController();

export class UsersController {
  /** Gets users. */
  public async getUsers() {
    return await dbClient.query.users.findMany({
      columns: {
        id: true,
        username: true,
      },
    });
  }

  public async getUserPermissions(user: User) {
    return (
      await dbClient
        .select({ permission: permissions.name })
        .from(users)
        .leftJoin(usersRoles, eq(users.id, usersRoles.userId))
        .leftJoin(roles, eq(usersRoles.roleId, roles.id))
        .leftJoin(rolesPermissions, eq(roles.id, rolesPermissions.roleId))
        .leftJoin(
          permissions,
          eq(rolesPermissions.permissionId, permissions.id),
        )
        .where(eq(users.id, user.userId))
    )
      .map((r) => r.permission)
      .filter(notNull);
  }

  public async getUserByUsername(username: string) {
    const user = await dbClient.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (user === undefined) {
      throw new RecordDoesNotExistError(
        `User with username: ${username} does not exist.`,
      );
    }
    return user;
  }

  /**
   * Gets a user by their id.
   * @param userId Id of user to get
   * @returns The user
   * @throws A {@link RecordDoesNotExistError} if a user does not exist by the provided id
   */
  public async getUserById(userId: string) {
    const user = await dbClient.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (user === undefined) {
      throw new RecordDoesNotExistError(
        `User with id: "${userId}" does not exist.`,
      );
    }
    return user;
  }

  /**
   * Gets all user level roles of the user.
   * @param userId Id of user to get roles of
   * @returns list of roles the user has
   */
  public async getUsersRoles(userId: string) {
    return await dbClient
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
      })
      .from(roles)
      .leftJoin(usersRoles, eq(usersRoles.roleId, roles.id))
      .leftJoin(users, eq(users.id, usersRoles.userId))
      .where(eq(users.id, userId));
  }

  /**
   * Adds a role to a user.
   * @param userId Id of user to add the role to
   * @param roleName name of role to add to the user
   * @throws A {@link DuplicateRecordError} if the user already has the role
   */
  public async addRoleToUser(userId: string, roleName: UserRole) {
    const usersRolesNames = (await this.getUsersRoles(userId)).map(
      (r) => r.name,
    );
    if (usersRolesNames.includes(roleName)) {
      const user = await this.getUserById(userId);
      throw new DuplicateRecordError(
        `User: "${user.username}" already has the role: "${roleName}"`,
      );
    }

    const role = await rolesController.getRoleByName(roleName);
    await dbClient.insert(usersRoles).values({ roleId: role.id, userId });
  }

  /**
   * Removes a role from a user.
   * Will not throw an error if user doesn't have the role.
   * @param userId id of user to remove the role from
   * @param roleId id of role to remove from the user
   */
  public async removeRoleFromUser(userId: string, roleId: number) {
    await dbClient
      .delete(usersRoles)
      .where(and(eq(usersRoles.userId, userId), eq(usersRoles.roleId, roleId)));
  }

  /**
   * Gets a user role relation.
   * @param userId id of user
   * @param roleId id of role
   * @returns The user and role if the relation exists
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async getUsersRolesRelation(userId: string, roleId: number) {
    const relation = await dbClient.query.usersRoles.findFirst({
      where: and(eq(usersRoles.userId, userId), eq(usersRoles.roleId, roleId)),
      with: {
        user: true,
        role: true,
      },
    });
    if (relation === undefined) {
      throw new RecordDoesNotExistError(
        `No relation exists between user with id: "${userId}" and role with id: "${roleId}".`,
      );
    }
    const { user, role } = relation;
    return { user, role };
  }
}
