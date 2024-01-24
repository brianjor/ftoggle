import { dbClient } from '@ftoggle/db/connection';
import { apiTokens } from '@ftoggle/db/schema';
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
}
