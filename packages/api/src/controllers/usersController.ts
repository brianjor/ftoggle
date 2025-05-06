import { UserRole } from '@ftoggle/common/enums/roles';
import { dbClient } from '@ftoggle/db/connection';
import {
  tPermissions,
  tRoles,
  tRolesPermissions,
  tUsers,
  tUsersPasswords,
  tUsersRoles,
} from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { User, generateId } from 'lucia';
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
    const usersPassword = await dbClient.query.tUsersPasswords.findFirst({
      where: eq(tUsersPasswords.userId, user.id),
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
      .update(tUsersPasswords)
      .set({ hashedPassword: newHashedPassword })
      .where(eq(tUsersPasswords.userId, user.id));
  }

  /**
   * Patch fields of the user, only specific fields are updatable. See {@link patchValues} for accepted fields.
   * @param userId id of the user to patch
   * @param patchValues values to patch the user with
   */
  async patchUser(
    userId: string,
    patchValues: {
      isApproved: boolean | undefined;
    },
  ) {
    // Needs to have at least one defined property
    // Drizzle will throw an error if there are no defined properties to set
    const hasDefined = Object.values(patchValues).some((v) => v !== undefined);
    if (!hasDefined) {
      // Only has undefined values. Nothing to change, return early.
      return;
    }
    await dbClient.update(tUsers).set(patchValues).where(eq(tUsers.id, userId));
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
      const usersPassword = await dbClient.query.tUsersPasswords.findFirst({
        where: eq(tUsersPasswords.userId, user.id),
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
      console.log('Hallo');
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
          .insert(tUsers)
          .values({
            id: userId,
            username,
          })
          .returning()
      )[0];
      await tx.insert(tUsersPasswords).values({
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
    const user = await dbClient.query.tUsers.findFirst({
      where: eq(tUsers.username, username),
    });
    return user !== undefined;
  }

  /** Gets users. */
  public async getUsers() {
    return await dbClient.query.tUsers.findMany({
      columns: {
        id: true,
        username: true,
      },
    });
  }

  /** Gets users and their roles */
  public async getUsersAndRoles() {
    return await dbClient.query.tUsers.findMany({
      with: {
        usersRoles: {
          with: {
            role: true,
          },
        },
      },
    });
  }

  public async getUserPermissions(user: User) {
    return (
      await dbClient
        .select({ permission: tPermissions.name })
        .from(tUsers)
        .leftJoin(tUsersRoles, eq(tUsers.id, tUsersRoles.userId))
        .leftJoin(tRoles, eq(tUsersRoles.roleId, tRoles.id))
        .leftJoin(tRolesPermissions, eq(tRoles.id, tRolesPermissions.roleId))
        .leftJoin(
          tPermissions,
          eq(tRolesPermissions.permissionId, tPermissions.id),
        )
        .where(eq(tUsers.id, user.id))
    )
      .map((r) => r.permission)
      .filter(notNull);
  }

  public async getUserByUsername(username: string) {
    const user = await dbClient.query.tUsers.findFirst({
      where: eq(tUsers.username, username),
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
    const user = await dbClient.query.tUsers.findFirst({
      where: eq(tUsers.id, userId),
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
        id: tRoles.id,
        name: tRoles.name,
        description: tRoles.description,
      })
      .from(tRoles)
      .leftJoin(tUsersRoles, eq(tUsersRoles.roleId, tRoles.id))
      .leftJoin(tUsers, eq(tUsers.id, tUsersRoles.userId))
      .where(eq(tUsers.id, userId));
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
    await dbClient.insert(tUsersRoles).values({ roleId: role.id, userId });
  }

  /**
   * Removes a role from a user.
   * Will not throw an error if user doesn't have the role.
   * @param userId id of user to remove the role from
   * @param roleId id of role to remove from the user
   */
  public async removeRoleFromUser(userId: string, roleId: number) {
    await dbClient
      .delete(tUsersRoles)
      .where(
        and(eq(tUsersRoles.userId, userId), eq(tUsersRoles.roleId, roleId)),
      );
  }

  /**
   * Gets a user role relation.
   * @param userId id of user
   * @param roleId id of role
   * @returns The user and role if the relation exists
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async getUsersRolesRelation(userId: string, roleId: number) {
    const relation = await dbClient.query.tUsersRoles.findFirst({
      where: and(
        eq(tUsersRoles.userId, userId),
        eq(tUsersRoles.roleId, roleId),
      ),
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
