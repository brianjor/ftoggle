import { dbClient } from '@ftoggle/db/connection';
import {
  environments,
  features,
  projectsFeaturesEnvironments,
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
        .select(getTableColumns(projectsFeaturesEnvironments))
        .from(projectsFeaturesEnvironments)
        .leftJoin(
          features,
          eq(features.id, projectsFeaturesEnvironments.featureId),
        )
        .leftJoin(
          environments,
          eq(environments.id, projectsFeaturesEnvironments.environmentId),
        )
        .where(
          and(
            eq(projectsFeaturesEnvironments.projectId, projectId),
            eq(features.name, featureName),
            eq(environments.name, environmentName),
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
        .update(projectsFeaturesEnvironments)
        .set({ isEnabled: !currentRelation.isEnabled })
        .where(
          and(
            eq(
              projectsFeaturesEnvironments.featureId,
              currentRelation.featureId,
            ),
            eq(
              projectsFeaturesEnvironments.environmentId,
              currentRelation.environmentId,
            ),
            eq(projectsFeaturesEnvironments.projectId, projectId),
          ),
        )
        .returning()
    )[0];
  }
}
