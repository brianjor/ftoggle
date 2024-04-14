import { dbClient } from '@ftoggle/db/connection';
import { tFeatures, tProjectsFeaturesEnvironments } from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import {
  DuplicateRecordError,
  RecordDoesNotExistError,
} from '../errors/dbErrors';
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
    const exists = await this.featureExists(projectId, name);
    if (exists) {
      throw new DuplicateRecordError(
        `Project: "${projectId}" already has a feature named: "${name}"`,
      );
    }

    const envs = await projectsController.getEnvironments(projectId);

    const feature = await dbClient.transaction(async (tx) => {
      const feature = (
        await tx.insert(tFeatures).values({ name, projectId }).returning()
      )[0];
      if (envs.length > 0) {
        await tx.insert(tProjectsFeaturesEnvironments).values(
          envs.map((env) => ({
            featureId: feature.id,
            environmentId: env.id,
            projectId: projectId,
          })),
        );
      }
      return feature;
    });
    return feature;
  }

  /**
   * Gets features for a project.
   * @param projectId id of project
   * @returns list of features
   */
  public async getFeatures(projectId: string) {
    return await dbClient.query.tFeatures.findMany({
      where: eq(tFeatures.projectId, projectId),
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
    const feature = await dbClient.query.tFeatures.findFirst({
      where: and(
        eq(tFeatures.name, featureName),
        eq(tFeatures.projectId, projectId),
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
   * Checks if a feature exists on a project.
   * @param projectId id of the project
   * @param featureName name of the feature
   * @returns true if the feature exists on the project, otherwise false.
   */
  public async featureExists(projectId: string, featureName: string) {
    const feature = await dbClient
      .select({})
      .from(tFeatures)
      .where(
        and(
          eq(tFeatures.name, featureName),
          eq(tFeatures.projectId, projectId),
        ),
      )
      .limit(1);
    return !!feature.length;
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
        .update(tFeatures)
        .set({ ...updateFields, modifiedAt: new Date() })
        .where(
          and(
            eq(tFeatures.name, featureName),
            eq(tFeatures.projectId, projectId),
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
      .delete(tFeatures)
      .where(
        and(
          eq(tFeatures.name, featureName),
          eq(tFeatures.projectId, projectId),
        ),
      );
  }
}
