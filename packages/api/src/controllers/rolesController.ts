import { dbClient } from '@ftoggle/db/connection';
import { roles } from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';
import { UserRole } from '../enums/roles';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class RolesController {
  /**
   * Gets a role by its name.
   * @param roleName name of the role to get
   * @returns the role
   * @throws A {@link RecordDoesNotExistError} if there is no role exists with the provided name
   */
  public async getRoleByName(roleName: UserRole) {
    const role = await dbClient.query.roles.findFirst({
      where: eq(roles.name, roleName),
    });
    if (role === undefined) {
      throw new RecordDoesNotExistError(
        `Role with name "${roleName}" does not exist.`,
      );
    }
    return role;
  }
}
