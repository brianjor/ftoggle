import { dbClient } from '@ftoggle/db/connection';
import {
  conditions as conditionsTable,
  contextFields,
} from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class ConditionsController {
  async createConditions(
    conditions: {
      description?: string;
      values: string[];
      operator: string;
      contextName: string;
    }[],
    projectId: string,
    featureId: number,
    environmentId: number,
  ) {
    if (conditions.length === 0) return;

    const fieldName = conditions[0].contextName;
    const contextField = await dbClient.query.contextFields.findFirst({
      where: and(
        eq(contextFields.name, fieldName),
        eq(contextFields.projectId, projectId),
      ),
    });
    if (!contextField) {
      throw new RecordDoesNotExistError(
        `Context field with name: "${fieldName}" does not exist`,
      );
    }

    await dbClient.insert(conditionsTable).values(
      conditions.map((c) => ({
        projectId,
        featureId,
        environmentId,
        contextFieldId: contextField?.id,
        values: c.values,
        description: c.description,
        operator: c.operator,
      })),
    );
  }

  /**
   * Gets all conditions for a project -> feature -> environment.
   * @param projectId id of the project
   * @param featureId id of the feature
   * @param environmentId id of the environment
   * @returns all conditions for the provided project, feature, environment
   */
  getProjectFeatureEnvironmentConditions(
    projectId: string,
    featureId: number,
    environmentId: number,
  ) {
    return dbClient.query.conditions.findMany({
      where: and(
        eq(conditionsTable.projectId, projectId),
        eq(conditionsTable.featureId, featureId),
        eq(conditionsTable.environmentId, environmentId),
      ),
      with: {
        contextField: true,
      },
    });
  }
}
