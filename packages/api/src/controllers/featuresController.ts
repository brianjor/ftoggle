import { dbClient } from '@ftoggle/db/connection';
import { features, featuresEnvironments } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import { FeaturesTableItem } from '../typeboxes';
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
    const envs = await this.projectsController.getEnvironments(projectId);
    const feature = (
      await dbClient.insert(features).values({ name, projectId }).returning()
    )[0];
    if (envs.length > 0) {
      await dbClient.insert(featuresEnvironments).values(
        envs.map((env) => ({
          featureId: feature.id,
          environmentId: env.id,
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
  public async getFeatures(projectId: number) {
    return (
      await dbClient.query.features.findMany({
        where: eq(features.projectId, projectId),
        columns: {
          id: true,
          name: true,
        },
        with: {
          environments: {
            columns: {
              isEnabled: true,
            },
            with: {
              environment: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })
    ).map((f) => ({
      id: f.id,
      name: f.name,
      environments: f.environments.map((e) => ({
        isEnabled: e.isEnabled,
        id: e.environment.id,
        name: e.environment.name,
      })),
    }));
  }

  /**
   * Gets a feature by project and feature id.
   * @param projectId id of the project
   * @param featureId id of the feature
   * @returns the feature
   * @throws A {@link RecordDoesNotExistError} if the feature does not exist
   */
  public async getProjectFeatureById(
    projectId: number,
    featureId: number,
  ): Promise<FeaturesTableItem> {
    const feature = await dbClient.query.features.findFirst({
      where: and(eq(features.id, featureId), eq(features.projectId, projectId)),
    });
    if (feature === undefined) {
      throw new RecordDoesNotExistError(
        `Feature with id: "${featureId}" does not exist on project with id: "${projectId}".`,
      );
    }
    return feature;
  }

  /**
   * Update a feature.
   * @param featureId id of feature
   * @param projectId id of project
   * @param updateFields fields of the feature to update
   */
  public async updateFeature(
    featureId: number,
    projectId: number,
    updateFields: { name?: string },
  ): Promise<FeaturesTableItem> {
    return (
      await dbClient
        .update(features)
        .set({ ...updateFields, modifiedAt: new Date() })
        .where(
          and(eq(features.id, featureId), eq(features.projectId, projectId)),
        )
        .returning()
    )[0];
  }
}
