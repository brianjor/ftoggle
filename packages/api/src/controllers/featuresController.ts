import { dbClient } from '@ftoggle/db/connection';
import { features, projectsFeaturesEnvironments } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import { FeaturesTableItem } from '../typeboxes/featuresTypes';
import { ProjectsController } from './projectsController';

const projectsController = new ProjectsController();

export class FeaturesController {
  /**
   * Creates a feature and adds it to the projects environments.
   * @param name Name of the feature
   * @param projectId Id of the project
   * @returns the created feature
   */
  public async addFeature(name: string, projectId: string) {
    const envs = await projectsController.getEnvironments(projectId);

    // TODO: Wrap in transaction, https://github.com/brianjor/ftoggle/issues/329
    const feature = (
      await dbClient.insert(features).values({ name, projectId }).returning()
    )[0];
    if (envs.length > 0) {
      await dbClient.insert(projectsFeaturesEnvironments).values(
        envs.map((env) => ({
          featureId: feature.id,
          environmentId: env.id,
          projectId: projectId,
        })),
      );
    }
    return feature;
  }

  /**
   * Gets features for a project.
   * @param projectId id of project
   * @returns list of features
   */
  public async getFeatures(projectId: string) {
    return await dbClient.query.features.findMany({
      where: eq(features.projectId, projectId),
      with: {
        environments: {
          with: {
            environment: true,
          },
        },
      },
    });
  }

  /**
   * Gets a feature by project and feature id.
   * @param projectId id of the project
   * @param featureName name of the feature
   * @returns the feature
   * @throws A {@link RecordDoesNotExistError} if the feature does not exist
   */
  public async getProjectFeature(
    projectId: string,
    featureName: string,
  ): Promise<FeaturesTableItem> {
    const feature = await dbClient.query.features.findFirst({
      where: and(
        eq(features.name, featureName),
        eq(features.projectId, projectId),
      ),
    });
    if (feature === undefined) {
      throw new RecordDoesNotExistError(
        `Feature: "${featureName}" does not exist on project with id: "${projectId}".`,
      );
    }
    return feature;
  }

  /**
   * Update a feature.
   * @param featureName name of the feature
   * @param projectId id of the project
   * @param updateFields fields of the feature to update
   */
  public async updateFeature(
    featureName: string,
    projectId: string,
    updateFields: { name?: string },
  ): Promise<FeaturesTableItem> {
    return (
      await dbClient
        .update(features)
        .set({ ...updateFields, modifiedAt: new Date() })
        .where(
          and(
            eq(features.name, featureName),
            eq(features.projectId, projectId),
          ),
        )
        .returning()
    )[0];
  }

  /**
   * Deletes the feature.
   * @param featureName name of the feature
   * @param projectId id of the project
   */
  async deleteProjectFeature(featureName: string, projectId: string) {
    await dbClient
      .delete(features)
      .where(
        and(eq(features.name, featureName), eq(features.projectId, projectId)),
      );
  }
}
