import { dbClient } from '@ftoggle/db/connection';
import { tContextFields } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import {
  DuplicateRecordError,
  RecordDoesNotExistError,
} from '../errors/dbErrors';

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
    const exists = await dbClient.query.tContextFields.findFirst({
      where: and(
        eq(tContextFields.projectId, projectId),
        eq(tContextFields.name, name),
      ),
    });
    if (exists) {
      throw new DuplicateRecordError(
        `A context field already exists with the name: "${name}"`,
      );
    }
    return await dbClient
      .insert(tContextFields)
      .values({ projectId, name, description })
      .returning();
  }

  /**
   * Gets the context fields for the project.
   * @param projectId the project id
   */
  async getContextFields(projectId: string) {
    return await dbClient.query.tContextFields.findMany({
      where: eq(tContextFields.projectId, projectId),
    });
  }

  /**
   * Gets a context field by its id
   * @param contextFieldId id of the context field
   * @returns the context field
   * @throws A {@link RecordDoesNotExistError} if the context field does not exist
   */
  async getContextField(contextFieldId: string) {
    const contextField = await dbClient.query.tContextFields.findFirst({
      where: eq(tContextFields.id, contextFieldId),
    });
    if (contextField === undefined) {
      throw new RecordDoesNotExistError(
        `Context Field with id: ${contextFieldId} does not exist`,
      );
    }
    return contextField;
  }

  /**
   * Deletes a context field from a project.
   * @param projectId id of the project
   * @param contextFieldName context fields name
   */
  async deleteContextFieldByName(projectId: string, contextFieldName: string) {
    await dbClient
      .delete(tContextFields)
      .where(
        and(
          eq(tContextFields.projectId, projectId),
          eq(tContextFields.name, contextFieldName),
        ),
      );
  }
}
