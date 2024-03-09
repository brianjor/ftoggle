import { dbClient } from '@ftoggle/db/connection';
import { contextFields } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { DuplicateRecordError } from '../errors/dbErrors';

export class ContextFieldController {
  /**
   *
   * @param fields context field properties
   * @returns
   */
  public async createContextField(
    projectId: string,
    name: string,
    description?: string,
  ) {
    const exists = await dbClient.query.contextFields.findFirst({
      where: and(
        eq(contextFields.projectId, projectId),
        eq(contextFields.name, name),
      ),
    });
    if (exists) {
      throw new DuplicateRecordError(
        `A context field already exists with the name: "${name}"`,
      );
    }
    return await dbClient
      .insert(contextFields)
      .values({ projectId, name, description })
      .returning();
  }

  /**
   * Gets the context fields for the project.
   * @param projectId the project id
   */
  async getContextFields(projectId: string) {
    return await dbClient.query.contextFields.findMany({
      where: eq(contextFields.projectId, projectId),
    });
  }
}
