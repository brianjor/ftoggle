import { UserRole } from '@ftoggle/common/enums/roles';
import { dbClient } from '@ftoggle/db/connection';
import { tRoles } from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class RolesController {
  /**
   * Gets a role by its name.
   * @param roleName name of the role to get
   * @returns the role
   * @throws A {@link RecordDoesNotExistError} if there is no role exists with the provided name
   */
  public async getRoleByName(roleName: UserRole) {
    const role = await dbClient.query.tRoles.findFirst({
      where: eq(tRoles.name, roleName),
    });
    if (role === undefined) {
      throw new RecordDoesNotExistError(
        `Role with name "${roleName}" does not exist.`,
      );
    }
    return role;
  }

  /**
   * Gets a role by its id.
   * @param roleId id of the role to get
   * @returns the role
   * @throws A {@link RecordDoesNotExistError} if there is no role exists with the provided id
   */
  public async getRoleById(roleId: number) {
    const role = await dbClient.query.tRoles.findFirst({
      where: eq(tRoles.id, roleId),
    });
    if (role === undefined) {
      throw new RecordDoesNotExistError(
        `Role with id: "${roleId}" does not exist.`,
      );
    }
    return role;
  }
}
