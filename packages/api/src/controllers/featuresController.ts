import { dbClient } from '@ftoggle/db/connection';
import { features, featuresEnvironments } from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';
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
}
