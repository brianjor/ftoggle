import { dbClient } from '@ftoggle/db/connection';
import { features, projectsFeaturesEnvironments } from '@ftoggle/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class FeaturesEnvironmentsController {
  /**
   * Gets a feature environment relation.
   * @param featureName name of feature
   * @param userId id of environment
   * @param projectId id of project
   * @returns The feature environment relation
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async getProjectFeatureEnvironmentRelation(
    featureName: string,
    environmentId: number,
    projectId: string,
  ) {
    const projectFeatureEnvironmentRelation = (
      await dbClient
        .select(getTableColumns(projectsFeaturesEnvironments))
        .from(projectsFeaturesEnvironments)
        .leftJoin(
          features,
          eq(features.id, projectsFeaturesEnvironments.featureId),
        )
        .where(
          and(
            eq(projectsFeaturesEnvironments.environmentId, environmentId),
            eq(projectsFeaturesEnvironments.projectId, projectId),
          ),
        )
    )[0];
    if (projectFeatureEnvironmentRelation === undefined) {
      throw new RecordDoesNotExistError(
        `No relation exists between feature: "${featureName}" and environment with id: "${environmentId}".`,
      );
    }
    return projectFeatureEnvironmentRelation;
  }

  /**
   * Toggles the 'isEnabled' column of a feature environment relation.
   * If 'isEnabled' is true, sets to false. If 'isEnabled' is false, sets to true.
   * @param featureName name of the feature
   * @param environmentId id of environment
   * @param projectId id of project
   * @returns The feature environment relation after toggling
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async toggleFeature(
    projectId: string,
    featureName: string,
    environmentId: number,
  ) {
    const currentRelation = await this.getProjectFeatureEnvironmentRelation(
      featureName,
      environmentId,
      projectId,
    );
    return (
      await dbClient
        .update(projectsFeaturesEnvironments)
        .set({ isEnabled: !currentRelation.isEnabled })
        .where(
          and(
            eq(
              projectsFeaturesEnvironments.featureId,
              currentRelation.featureId,
            ),
            eq(projectsFeaturesEnvironments.environmentId, environmentId),
            eq(projectsFeaturesEnvironments.projectId, projectId),
          ),
        )
        .returning()
    )[0];
  }
}
