import { dbClient } from '@ftoggle/db/connection';
import { features, featuresEnvironments } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import { ProjectsController } from './projectsController';

export class FeaturesController {
  constructor(private projectsController: ProjectsController) {
    this.projectsController = new ProjectsController();
  }

  /**
   * Creates a feature and adds it to the projects environments.
   * @param name Name of the feature
   * @param projectId Id of the project
   * @returns the created feature
   */
  public async addFeature(name: string, projectId: number) {
    const environments =
      await this.projectsController.getEnvironments(projectId);
    const feature = (
      await dbClient.insert(features).values({ name, projectId }).returning()
    )[0];
    await dbClient.insert(featuresEnvironments).values(
      environments.map((env) => ({
        featureId: feature.id,
        environmentId: env.id,
      })),
    );
    return feature;
  }

  public async getFeatures(projectId: number) {
    return await dbClient
      .select()
      .from(features)
      .where(eq(features.projectId, projectId));
  }

  public async getFeature(featureId: number) {
    return await dbClient
      .select()
      .from(features)
      .where(eq(features.id, featureId));
  }

  /**
   * Gets a feature environment relation.
   * @param featureId id of feature
   * @param userId id of environment
   * @param options extra options
   * @returns The feature and environment
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  public async getFeaturesEnvironmentsRelation(
    featureId: number,
    environmentId: number,
  ) {
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
}
