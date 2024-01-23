import { dbClient } from '@ftoggle/db/connection';
import { projectsFeaturesEnvironments } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class FeaturesEnvironmentsController {
  /**
   * Gets a feature environment relation.
   * @param featureId id of feature
   * @param userId id of environment
   * @param projectId id of project
   * @returns The feature environment relation
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async getRelation(
    featureId: number,
    environmentId: number,
    projectId: string,
  ) {
    const featureEnvironmentRelation =
      await dbClient.query.projectsFeaturesEnvironments.findFirst({
        where: and(
          eq(projectsFeaturesEnvironments.featureId, featureId),
          eq(projectsFeaturesEnvironments.environmentId, environmentId),
          eq(projectsFeaturesEnvironments.projectId, projectId),
        ),
        with: {
          environment: true,
          feature: true,
        },
      });
    if (featureEnvironmentRelation === undefined) {
      throw new RecordDoesNotExistError(
        `No relation exists between feature with id: "${featureId}" and environment with id: "${environmentId}".`,
      );
    }
    return featureEnvironmentRelation;
  }

  /**
   * Toggles the 'isEnabled' column of a feature environment relation.
   * If 'isEnabled' is true, sets to false. If 'isEnabled' is false, sets to true.
   * @param featureId id of feature
   * @param environmentId id of environment
   * @param projectId id of project
   * @returns The feature environment relation after toggling
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async toggleFeature(
    featureId: number,
    environmentId: number,
    projectId: string,
  ) {
    const currentRelation = await this.getRelation(
      featureId,
      environmentId,
      projectId,
    );
    return (
      await dbClient
        .update(projectsFeaturesEnvironments)
        .set({ isEnabled: !currentRelation.isEnabled })
        .where(
          and(
            eq(projectsFeaturesEnvironments.featureId, featureId),
            eq(projectsFeaturesEnvironments.environmentId, environmentId),
            eq(projectsFeaturesEnvironments.projectId, projectId),
          ),
        )
        .returning()
    )[0];
  }
}
