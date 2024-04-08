import { ApiTokenType } from '@ftoggle/common/enums/apiTokens';
import { dbClient } from '@ftoggle/db/connection';
import { apiTokens, projects } from '@ftoggle/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import {
  ApiTokenWithProjectAndEnvironment,
  ApiTokensTableItem,
} from '../typeboxes/apiTokensTypes';

export class ApiTokensController {
  /**
   * Creates an API token.
   * @param fields Fields required to create an API token
   * @returns the new API token
   */
  public async createApiToken(fields: {
    projectId: string;
    environmentId: string;
    name: string;
    type: ApiTokenType;
    userId: string;
  }): Promise<ApiTokensTableItem> {
    return (await dbClient.insert(apiTokens).values(fields).returning())[0];
  }

  /**
   * Gets an API token by it's id
   * @param apiTokenId id of the API token
   * @returns the API token
   * @throws A {@link RecordDoesNotExistError} if the API token does not exist
   */
  public async getApiTokenById(
    apiTokenId: string,
  ): Promise<ApiTokenWithProjectAndEnvironment> {
    const apiToken = await dbClient.query.apiTokens.findFirst({
      where: eq(apiTokens.id, apiTokenId),
      with: {
        project: true,
        environment: true,
      },
    });
    if (apiToken === undefined) {
      throw new RecordDoesNotExistError(
        `ApiToken with id: ${apiTokenId} does not exist`,
      );
    }
    return apiToken;
  }

  /**
   * Gets the projects API tokens
   * @param projectId id of the project
   * @returns API tokens for the project
   */
  public async getApiTokensForProject(
    projectId: string,
  ): Promise<ApiTokensTableItem[]> {
    return await dbClient
      .select(getTableColumns(apiTokens))
      .from(apiTokens)
      .leftJoin(projects, eq(apiTokens.projectId, projects.id))
      .where(eq(apiTokens.projectId, projectId));
  }

  /**
   * Deletes an api token for the given API token id.
   * @param apiTokenId id of the API token
   */
  public async deleteApiTokenById(apiTokenId: string): Promise<void> {
    await dbClient.delete(apiTokens).where(eq(apiTokens.id, apiTokenId));
  }
}
