import { dbClient } from '@ftoggle/db/connection';
import {
  tEnvironments,
  tFeatures,
  tProjects,
  tProjectsFeaturesEnvironments,
} from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import {
  DuplicateRecordError,
  RecordDoesNotExistError,
} from '../errors/dbErrors';

export class ProjectsController {
  public async getProjects() {
    return await dbClient
      .select({
        id: tProjects.id,
        name: tProjects.name,
        createdAt: tProjects.createdAt,
        modifiedAt: tProjects.modifiedAt,
      })
      .from(tProjects);
  }

  /**
   * Gets a project by its id.
   * @param projectId Id of project to get
   * @returns the project
   * @throws A {@link RecordDoesNotExistError} if the project does not exist
   */
  public async getProjectById(projectId: string) {
    const project = await dbClient.query.tProjects.findFirst({
      where: eq(tProjects.id, projectId),
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
    const exists = await dbClient.query.tProjects.findFirst({
      where: eq(tProjects.id, projectId),
    });
    if (exists) {
      throw new DuplicateRecordError(
        `A project already exists with the id: "${projectId}"`,
      );
    }
    return (
      await dbClient
        .insert(tProjects)
        .values({ id: projectId, name: projectName })
        .returning()
    )[0];
  }

  public async updateProject(
    projectId: string,
    updateFields: { name?: string },
  ) {
    await dbClient
      .update(tProjects)
      .set({ name: updateFields.name, modifiedAt: new Date() })
      .where(eq(tProjects.id, projectId));
  }

  public async getEnvironments(projectId: string) {
    return await dbClient.query.tEnvironments.findMany({
      where: eq(tEnvironments.projectId, projectId),
    });
  }

  /**
   * Gets an environment for a project.
   * @param projectId Id of the project the environment is attached to
   * @param enviromentName name of then environment to get
   * @returns the environment
   * @throws An {@link RecordDoesNotExistError} if there is no environment with that name
   */
  public async getProjectEnvironment(
    projectId: string,
    enviromentName: string,
  ) {
    const env = await dbClient.query.tEnvironments.findFirst({
      where: and(
        eq(tEnvironments.name, enviromentName),
        eq(tEnvironments.projectId, projectId),
      ),
    });
    if (env === undefined) {
      throw new RecordDoesNotExistError(
        `Environment: "${enviromentName}" does not exist`,
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
          .insert(tEnvironments)
          .values({ name: envName, projectId })
          .returning()
      )[0];
      // Get all the projects features
      const featIds = (
        await tx
          .select({ id: tFeatures.id })
          .from(tFeatures)
          .where(eq(tFeatures.projectId, projectId))
      ).map((f) => f.id);
      // Attach all features to the environment
      if (featIds.length > 0) {
        await tx.insert(tProjectsFeaturesEnvironments).values(
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
   * @param projectId id of the project
   * @param environmentName name of the environment
   * @throws A {@link RecordDoesNotExistError} if the environment does not have a relation to the project
   */
  public async deleteEnvironment(projectId: string, environmentName: string) {
    const project = await this.getProjectById(projectId);
    const env = await this.getProjectEnvironment(projectId, environmentName);
    if (project.id !== env.projectId) {
      throw new RecordDoesNotExistError(
        `Environment: "${environmentName}" does not exist on project with id: "${projectId}"`,
      );
    }
    await dbClient.transaction(async (tx) => {
      await tx
        .delete(tProjectsFeaturesEnvironments)
        .where(eq(tProjectsFeaturesEnvironments.environmentId, env.id));
      await tx.delete(tEnvironments).where(eq(tEnvironments.id, env.id));
    });
    return env;
  }

  /**
   * Gets a project environment relation.
   * @param projectId id of the project
   * @param environmentName name of the environment
   * @returns The project and environment relation
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  async getProjectsEnvironmentsRelation(
    projectId: string,
    environmentName: string,
  ) {
    const projectEnvironmentRelation =
      await dbClient.query.tEnvironments.findFirst({
        where: and(
          eq(tEnvironments.name, environmentName),
          eq(tEnvironments.projectId, projectId),
        ),
        with: {
          project: true,
        },
      });
    if (projectEnvironmentRelation === undefined) {
      throw new RecordDoesNotExistError(
        `No relation exists between project with id: "${projectId}" and environment: "${environmentName}".`,
      );
    }
    return projectEnvironmentRelation;
  }

  /**
   * Deletes a project.
   * @param projectId id of the project to delete
   */
  public async deleteProject(projectId: string) {
    await dbClient.delete(tProjects).where(eq(tProjects.id, projectId));
  }

  /**
   * Archives a project.
   * @param projectId Id of project to be archived
   */
  public async archiveProject(projectId: string) {
    await dbClient
      .update(tProjects)
      .set({ isArchived: true, modifiedAt: new Date() })
      .where(eq(tProjects.id, projectId));
  }
}
