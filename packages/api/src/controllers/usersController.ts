import { dbClient } from '@ftoggle/db/connection';
import {
  permissions,
  roles,
  rolesPermissions,
  users,
  usersPasswords,
  usersRoles,
} from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { User, generateId } from 'lucia';
import { UserRole } from '../enums/roles';
import { AuthenticationError, BadRequestError } from '../errors/apiErrors';
import {
  DuplicateRecordError,
  RecordDoesNotExistError,
} from '../errors/dbErrors';
import { notNull } from '../helpers/filtering';
import { RolesController } from './rolesController';

const rolesController = new RolesController();

export class UsersController {
  /**
   * Updates a users password.
   * @param user the user to update their password
   * @param oldPassword old password
   * @param newPassword new password
   * @throws An error if user is not a password user
   */
  async updatePassword(user: User, oldPassword: string, newPassword: string) {
    const usersPassword = await dbClient.query.usersPasswords.findFirst({
      where: eq(usersPasswords.userId, user.id),
    });
    if (usersPassword === undefined) {
      throw new BadRequestError('User is not a password user.');
    }
    const validPassword = await Bun.password.verify(
      oldPassword,
      usersPassword.hashedPassword,
    );
    if (!validPassword) {
      throw new AuthenticationError('Invalid password');
    }
    const newHashedPassword = await Bun.password.hash(newPassword);
    await dbClient
      .update(usersPasswords)
      .set({ hashedPassword: newHashedPassword })
      .where(eq(usersPasswords.userId, user.id));
  }

  /**
   * Validates a username password users login.
   * @param username users username
   * @param password users password
   * @returns if valid credentials are provided: the user is returned
   * @throws A generic error to hide at which point the validation failed
   */
  public async validateUsernamePasswordLogin(
    username: string,
    password: string,
  ) {
    try {
      const user = await this.getUserByUsername(username);
      const usersPassword = await dbClient.query.usersPasswords.findFirst({
        where: eq(usersPasswords.userId, user.id),
      });
      if (usersPassword === undefined) {
        throw new BadRequestError(
          `User: ${user.username} is not a password user.`,
        );
      }
      const validPassword = await Bun.password.verify(
        password,
        usersPassword.hashedPassword,
      );
      if (!validPassword) {
        throw new AuthenticationError('Invalid password');
      }
      return user;
    } catch (err) {
      // Catch any errors thrown and log them
      console.error(err);
      // Throw a generic validation error
      throw new AuthenticationError('Invalid user credentials');
    }
  }

  /**
   * Creates a new username and password user.
   * @param username users username
   * @param password users password
   * @returns the newly created user
   * @throw A {@link DuplicateRecordError} if username is already taken
   */
  public async createUsernameAndPasswordUser(
    username: string,
    password: string,
  ) {
    const exists = await this.usernameExists(username);
    if (exists) {
      throw new DuplicateRecordError(
        `Username "${username}" is already taken.`,
      );
    }

    const hashedPassword = await Bun.password.hash(password);
    const userId = generateId(15);
    const user = await dbClient.transaction(async (tx) => {
      const user = (
        await tx
          .insert(users)
          .values({
            id: userId,
            username,
          })
          .returning()
      )[0];
      await tx.insert(usersPasswords).values({
        hashedPassword,
        userId,
      });
      return user;
    });
    return user;
  }

  /**
   * Checks if a username exists.
   * @param username username to check exists
   * @returns true if username exists, false otherwise
   */
  public async usernameExists(username: string) {
    const user = await dbClient.query.users.findFirst({
      where: eq(users.username, username),
    });
    return user !== undefined;
  }

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
        .where(eq(users.id, user.id))
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
