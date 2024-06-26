import {
  MultiValueOperatorsValues,
  Operators,
  SingleValueOperatorsValues,
} from '@ftoggle/common/enums/operators';
import { dbClient } from '@ftoggle/db/connection';
import { tConditions, tContextFields, tFeatures } from '@ftoggle/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import { ConditionsTableItem } from '../typeboxes/conditionsTypes';

export class ConditionsController {
  async createConditions(
    conditions: {
      description?: string;
      values?: string[];
      value?: string;
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
        values: MultiValueOperatorsValues.includes(c.operator)
          ? c.values ?? []
          : [],
        value: SingleValueOperatorsValues.includes(c.operator) ? c.value : null,
        description: c.description,
        operator: c.operator,
      })),
    );
  }

  /**
   * Gets the condition by its id.
   * @param conditionId id of the condition
   * @returns the condition
   * @throws A {@link RecordDoesNotExistError} if the condition does not exist
   */
  async getConditionById(conditionId: string) {
    const condition = await dbClient.query.tConditions.findFirst({
      where: eq(tConditions.id, conditionId),
    });

    if (!condition) {
      throw new RecordDoesNotExistError(
        `Condition with id: "${conditionId}" does not exist.`,
      );
    }
    return condition;
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
   * Patches a condition.
   * @param condition the condition to patch
   * @param value a single condition value
   * @param values multiple condition values
   */
  async patchCondition(
    condition: ConditionsTableItem,
    operator: Operators,
    value: string | undefined,
    values: string[] | undefined,
  ) {
    await dbClient
      .update(tConditions)
      .set({ operator, value, values })
      .where(eq(tConditions.id, condition.id));
  }

  /**
   * Deletes a condition by its id.
   * @param conditionId id of the condition
   */
  async deleteConditionById(conditionId: string) {
    await dbClient.delete(tConditions).where(eq(tConditions.id, conditionId));
  }
}
