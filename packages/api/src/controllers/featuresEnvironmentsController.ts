import { dbClient } from '@ftoggle/db/connection';
import { featuresEnvironments } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class FeaturesEnvironmentsController {
  /**
   * Gets a feature environment relation.
   * @param featureId id of feature
   * @param userId id of environment
   * @returns The feature environment relation
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async getRelation(featureId: number, environmentId: number) {
    const featureEnvironmentRelation =
      await dbClient.query.featuresEnvironments.findFirst({
        where: and(
          eq(featuresEnvironments.featureId, featureId),
          eq(featuresEnvironments.environmentId, environmentId),
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
   * @param userId id of environment
   * @returns The feature environment relation after toggling
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async toggleFeature(featureId: number, environmentId: number) {
    const currentRelation = await this.getRelation(featureId, environmentId);
    return (
      await dbClient
        .update(featuresEnvironments)
        .set({ isEnabled: !currentRelation.isEnabled })
        .where(
          and(
            eq(featuresEnvironments.featureId, featureId),
            eq(featuresEnvironments.environmentId, environmentId),
          ),
        )
        .returning()
    )[0];
  }
}
