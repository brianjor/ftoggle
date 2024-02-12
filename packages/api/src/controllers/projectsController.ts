import { dbClient } from '@ftoggle/db/connection';
import {
  environments,
  features,
  projects,
  projectsFeaturesEnvironments,
} from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class ProjectsController {
  public async getProjects() {
    return await dbClient
      .select({
        id: projects.id,
        name: projects.name,
        createdAt: projects.createdAt,
        modifiedAt: projects.modifiedAt,
      })
      .from(projects);
  }

  /**
   * Gets a project by its id.
   * @param projectId Id of project to get
   * @returns the project
   * @throws A {@link RecordDoesNotExistError} if the project does not exist
   */
  public async getProjectById(projectId: string) {
    const project = await dbClient.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        features: {
          with: {
            environments: {
              with: {
                environment: true,
              },
            },
          },
        },
        environments: true,
      },
    });
    if (project === undefined) {
      throw new RecordDoesNotExistError(
        `Project with id: "${projectId}" does not exist.`,
      );
    }
    return project;
  }

  public async createProject(projectId: string, projectName: string) {
    return (
      await dbClient
        .insert(projects)
        .values({ id: projectId, name: projectName })
        .returning()
    )[0];
  }

  public async updateProject(
    projectId: string,
    updateFields: { name?: string },
  ) {
    await dbClient
      .update(projects)
      .set({ name: updateFields.name, modifiedAt: new Date() })
      .where(eq(projects.id, projectId));
  }

  public async getEnvironments(projectId: string) {
    return await dbClient.query.environments.findMany({
      where: eq(environments.projectId, projectId),
    });
  }

  /**
   * Gets an environment by its id.
   * @param projectId Id of project the environment is attached to
   * @param enviromentId Id of environment to get
   * @returns the environment
   * @throws An {@link RecordDoesNotExistError} if there is no environment with that id
   */
  public async getEnvironmentById(projectId: string, enviromentId: number) {
    const env = await dbClient.query.environments.findFirst({
      where: and(
        eq(environments.id, enviromentId),
        eq(environments.projectId, projectId),
      ),
    });
    if (env === undefined) {
      throw new RecordDoesNotExistError(
        `Environment with id: "${enviromentId}" does not exist`,
      );
    }
    return env;
  }

  /**
   * Adds an environment to a project.
   * Attaches all of the projects features to the environment.
   * @param envName name of the environment
   * @param projectId id of the project
   * @returns the newly created environment
   */
  public async addEnvironment(envName: string, projectId: string) {
    const env = await dbClient.transaction(async (tx) => {
      // Create the environment
      const env = (
        await tx
          .insert(environments)
          .values({ name: envName, projectId })
          .returning()
      )[0];
      // Get all the projects features
      const featIds = (
        await tx
          .select({ id: features.id })
          .from(features)
          .where(eq(features.projectId, projectId))
      ).map((f) => f.id);
      // Attach all features to the environment
      if (featIds.length > 0) {
        await tx.insert(projectsFeaturesEnvironments).values(
          featIds.map((fId) => ({
            featureId: fId,
            environmentId: env.id,
            projectId: projectId,
          })),
        );
      }
      return env;
    });
    return env;
  }

  /**
   * Delete an environment from a project.
   * @param projectId id of project
   * @param environmentId id of environment
   * @throws A {@link RecordDoesNotExistError} if the environment does not have a relation to the project
   */
  public async deleteEnvironment(projectId: string, environmentId: number) {
    const project = await this.getProjectById(projectId);
    const env = await this.getEnvironmentById(projectId, environmentId);
    if (project.id !== env.projectId) {
      throw new RecordDoesNotExistError(
        `Environment with id: "${environmentId}" does not exist on project with id: "${projectId}"`,
      );
    }
    await dbClient.transaction(async (tx) => {
      await tx
        .delete(projectsFeaturesEnvironments)
        .where(eq(projectsFeaturesEnvironments.environmentId, environmentId));
      await tx.delete(environments).where(eq(environments.id, environmentId));
    });
    return env;
  }

  /**
   * Gets a project environment relation.
   * @param projectId id of project
   * @param environmentId id of environment
   * @returns The project and environment relation
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  async getProjectsEnvironmentsRelation(
    projectId: string,
    environmentId: number,
  ) {
    const projectEnvironmentRelation =
      await dbClient.query.environments.findFirst({
        where: and(
          eq(environments.id, environmentId),
          eq(environments.projectId, projectId),
        ),
        with: {
          project: true,
        },
      });
    if (projectEnvironmentRelation === undefined) {
      throw new RecordDoesNotExistError(
        `No relation exists between project with id: "${projectId}" and environment with id: "${environmentId}".`,
      );
    }
    return projectEnvironmentRelation;
  }

  /**
   * Deletes a project.
   * @param projectId id of the project to delete
   */
  public async deleteProject(projectId: string) {
    await dbClient.delete(projects).where(eq(projects.id, projectId));
  }

  /**
   * Archives a project.
   * @param projectId Id of project to be archived
   */
  public async archiveProject(projectId: string) {
    await dbClient
      .update(projects)
      .set({ isArchived: true, modifiedAt: new Date() })
      .where(eq(projects.id, projectId));
  }
}
