import { dbClient } from '@ftoggle/db/connection';
import { tEnvironments } from '@ftoggle/db/schema';
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
    environmentId: string,
  ): Promise<EnvironmentsTableItem> {
    const env = await dbClient.query.tEnvironments.findFirst({
      where: eq(tEnvironments.id, environmentId),
    });
    if (env === undefined) {
      throw new RecordDoesNotExistError(
        `Environment with id: ${environmentId} does not exist.`,
      );
    }
    return env;
  }
}
