import { dbClient } from '@ftoggle/db/connection';
import { tConditions, tContextFields, tFeatures } from '@ftoggle/db/schema';
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
    const contextField = await dbClient.query.tContextFields.findFirst({
      where: and(
        eq(tContextFields.name, fieldName),
        eq(tContextFields.projectId, projectId),
      ),
    });
    if (!contextField) {
      throw new RecordDoesNotExistError(
        `Context field: "${fieldName}" does not exist`,
      );
    }
    const feature = await dbClient.query.tFeatures.findFirst({
      where: eq(tFeatures.name, featureName),
      columns: {
        id: true,
      },
    });
    if (feature === undefined) {
      throw new RecordDoesNotExistError(
        `Feature: ${featureName} does not exist.`,
      );
    }
    await dbClient.insert(tConditions).values(
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
        ...getTableColumns(tConditions),
        contextField: getTableColumns(tContextFields),
      })
      .from(tConditions)
      .leftJoin(tFeatures, eq(tFeatures.id, tConditions.featureId))
      .innerJoin(
        tContextFields,
        eq(tContextFields.id, tConditions.contextFieldId),
      )
      .where(
        and(
          eq(tConditions.projectId, projectId),
          eq(tFeatures.name, featureName),
          eq(tConditions.environmentId, environmentId),
        ),
      );
  }

  /**
   * Deletes a condition by its id.
   * @param conditionId id of the condition
   */
  async deleteConditionById(conditionId: string) {
    await dbClient.delete(tConditions).where(eq(tConditions.id, conditionId));
  }
}
