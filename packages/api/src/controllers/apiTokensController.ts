import { dbClient } from '@ftoggle/db/connection';
import { apiTokens, projects } from '@ftoggle/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { ApiTokenType } from '../enums/apiTokens';
import { ApiTokensTableItem } from '../typeboxes/apiTokensTypes';

export class ApiTokensController {
  /**
   * Creates an API token.
   * @param fields Fields required to create an API token
   * @returns the new API token
   */
  public async createApiToken(fields: {
    projectId: string;
    environmentId: number;
    name: string;
    type: ApiTokenType;
    userId: string;
  }): Promise<ApiTokensTableItem> {
    return (await dbClient.insert(apiTokens).values(fields).returning())[0];
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
}
