import { dbClient } from '@ftoggle/db/connection';
import { environments } from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import { EnvironmentsTableItem } from '../typeboxes/environmentTypes';

export class EnvironmentsController {
  /**
   * Gets an environment by id.
   * @param environmentId id of the environment
   * @returns the environment
   * @throws A {@link RecordDoesNotExistError} if there is no environment with that id
   */
  public async getEnvironmentById(
    environmentId: number,
  ): Promise<EnvironmentsTableItem> {
    const env = await dbClient.query.environments.findFirst({
      where: eq(environments.id, environmentId),
    });
    if (env === undefined) {
      throw new RecordDoesNotExistError(
        `Environment with id: ${environmentId} does not exist.`,
      );
    }
    return env;
  }
}
