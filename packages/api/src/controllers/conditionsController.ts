import { dbClient } from '@ftoggle/db/connection';
import {
  conditions,
  conditions as conditionsTable,
  contextFields,
  features,
} from '@ftoggle/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
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
    featureName: string,
    environmentId: string,
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
        `Context field: "${fieldName}" does not exist`,
      );
    }
    const feature = await dbClient.query.features.findFirst({
      where: eq(features.name, featureName),
      columns: {
        id: true,
      },
    });
    if (feature === undefined) {
      throw new RecordDoesNotExistError(
        `Feature: ${featureName} does not exist.`,
      );
    }
    await dbClient.insert(conditionsTable).values(
      conditions.map((c) => ({
        projectId,
        featureId: feature.id,
        environmentId: environmentId,
        contextFieldId: contextField.id,
        values: c.values,
        description: c.description,
        operator: c.operator,
      })),
    );
  }

  /**
   * Gets all conditions for a project -> feature -> environment.
   * @param projectId id of the project
   * @param featureName name of the feature
   * @param environmentId id of the environment
   * @returns all conditions for the provided project, feature, environment
   */
  getProjectFeatureEnvironmentConditions(
    projectId: string,
    featureName: string,
    environmentId: string,
  ) {
    return dbClient
      .select({
        ...getTableColumns(conditions),
        contextField: getTableColumns(contextFields),
      })
      .from(conditions)
      .leftJoin(features, eq(features.id, conditions.featureId))
      .innerJoin(contextFields, eq(contextFields.id, conditions.contextFieldId))
      .where(
        and(
          eq(conditionsTable.projectId, projectId),
          eq(features.name, featureName),
          eq(conditionsTable.environmentId, environmentId),
        ),
      );
  }

  /**
   * Deletes a condition by its id.
   * @param conditionId id of the condition
   */
  async deleteConditionById(conditionId: string) {
    await dbClient.delete(conditions).where(eq(conditions.id, conditionId));
  }
}
