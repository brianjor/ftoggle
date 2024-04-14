import { dbClient } from '@ftoggle/db/connection';
import {
  tEnvironments,
  tFeatures,
  tProjectsFeaturesEnvironments,
} from '@ftoggle/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class FeaturesEnvironmentsController {
  /**
   * Gets a feature environment relation.
   * @param featureName name of the feature
   * @param environmentName name of the environment
   * @param projectId id of the project
   * @returns The feature environment relation
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async getProjectFeatureEnvironmentRelation(
    projectId: string,
    featureName: string,
    environmentName: string,
  ) {
    const projectFeatureEnvironmentRelation = (
      await dbClient
        .select(getTableColumns(tProjectsFeaturesEnvironments))
        .from(tProjectsFeaturesEnvironments)
        .leftJoin(
          tFeatures,
          eq(tFeatures.id, tProjectsFeaturesEnvironments.featureId),
        )
        .leftJoin(
          tEnvironments,
          eq(tEnvironments.id, tProjectsFeaturesEnvironments.environmentId),
        )
        .where(
          and(
            eq(tProjectsFeaturesEnvironments.projectId, projectId),
            eq(tFeatures.name, featureName),
            eq(tEnvironments.name, environmentName),
          ),
        )
    )[0];
    if (projectFeatureEnvironmentRelation === undefined) {
      throw new RecordDoesNotExistError(
        `No relation exists between feature: "${featureName}" and environment with id: "${environmentName}".`,
      );
    }
    return projectFeatureEnvironmentRelation;
  }

  /**
   * Toggles the 'isEnabled' column of a feature environment relation.
   * If 'isEnabled' is true, sets to false. If 'isEnabled' is false, sets to true.
   * @param featureName name of the feature
   * @param environmentName name of the environment
   * @param projectId id of the project
   * @returns The feature environment relation after toggling
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async toggleFeature(
    projectId: string,
    featureName: string,
    environmentName: string,
  ) {
    const currentRelation = await this.getProjectFeatureEnvironmentRelation(
      projectId,
      featureName,
      environmentName,
    );
    return (
      await dbClient
        .update(tProjectsFeaturesEnvironments)
        .set({ isEnabled: !currentRelation.isEnabled })
        .where(
          and(
            eq(
              tProjectsFeaturesEnvironments.featureId,
              currentRelation.featureId,
            ),
            eq(
              tProjectsFeaturesEnvironments.environmentId,
              currentRelation.environmentId,
            ),
            eq(tProjectsFeaturesEnvironments.projectId, projectId),
          ),
        )
        .returning()
    )[0];
  }
}
