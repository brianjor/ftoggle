import { dbClient } from '@ftoggle/db/connection';
import {
  environments,
  features,
  featuresEnvironments,
  permissions,
  projects,
  projectsUsers,
  projectsUsersRoles,
  roles,
  rolesPermissions,
  users,
} from '@ftoggle/db/schema';
import { and, eq } from 'drizzle-orm';
import { ProjectRole } from '../enums/roles';
import { RecordDoesNotExistError } from '../errors/dbErrors';

export class ProjectsController {
  public async getProjects(userId: string) {
    return await dbClient
      .select({
        name: projects.name,
      })
      .from(projects)
      .leftJoin(projectsUsers, eq(projects.id, projectsUsers.projectId))
      .leftJoin(users, eq(projectsUsers.userId, users.id))
      .where(eq(users.id, userId));
  }

  /**
   * Gets users of a project.
   * @param projectId Id of project to get users of
   * @returns List of users of the project
   */
  public async getUsersOfProject(projectId: number) {
    return await dbClient
      .select({
        id: users.id,
        username: users.username,
      })
      .from(users)
      .leftJoin(projectsUsers, eq(projectsUsers.userId, users.id))
      .leftJoin(projects, eq(projects.id, projectsUsers.projectId))
      .where(eq(projects.id, projectId));
  }

  /**
   * Gets a project by its id.
   * @param projectId Id of project to get
   * @returns the project
   * @throws A {@link RecordDoesNotExistError} if the project does not exist
   */
  public async getProjectById(projectId: number) {
    const project = await dbClient.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        features: true,
      },
    });
    if (project === undefined) {
      throw new RecordDoesNotExistError(
        `Project with id: "${projectId}" does not exist.`,
      );
    }
    return project;
  }

  public async createProject(projectName: string) {
    return (
      await dbClient.insert(projects).values({ name: projectName }).returning()
    )[0];
  }

  public async updateProject(
    projectId: number,
    updateFields: { name?: string },
  ) {
    await dbClient
      .update(projects)
      .set({ name: updateFields.name, modifiedAt: new Date() })
      .where(eq(projects.id, projectId));
  }

  public async addUser(projectId: number, userId: string) {
    return (
      await dbClient
        .insert(projectsUsers)
        .values({ projectId, userId })
        .returning()
    )[0];
  }

  public async addRoleToUser(
    projectId: number,
    userId: string,
    roleName: ProjectRole,
  ) {
    // Support for INSERT after WITH clause is only in beta: https://github.com/drizzle-team/drizzle-orm/issues/1541
    const role = (
      await dbClient
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.name, roleName))
    )[0];
    await dbClient
      .insert(projectsUsersRoles)
      .values({ projectId, userId, roleId: role.id });
  }

  public async getEnvironments(projectId: number) {
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
  public async getEnvironmentById(projectId: number, enviromentId: number) {
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
  public async addEnvironment(envName: string, projectId: number) {
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
      await tx
        .insert(featuresEnvironments)
        .values(
          featIds.map((fId) => ({ featureId: fId, environmentId: env.id })),
        );
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
  public async deleteEnvironment(projectId: number, environmentId: number) {
    const project = await this.getProjectById(projectId);
    const env = await this.getEnvironmentById(projectId, environmentId);
    if (project.id !== env.projectId) {
      throw new RecordDoesNotExistError(
        `Environment with id: "${environmentId}" does not exist on project with id: "${projectId}"`,
      );
    }
    await dbClient.transaction(async (tx) => {
      await tx
        .delete(featuresEnvironments)
        .where(eq(featuresEnvironments.environmentId, environmentId));
      await tx.delete(environments).where(eq(environments.id, environmentId));
    });
    return env;
  }

  /**
   * Gets a list of permissions that a user has for a project.
   * @param projectId Id of the project to get roles for
   * @param userId Id of the user to get roles for
   * @returns list of the users permissions for the project
   */
  public async getUsersPermissions(projectId: number, userId: string) {
    return (
      await dbClient
        .select({ permission: permissions.name })
        .from(projectsUsersRoles)
        .leftJoin(roles, eq(projectsUsersRoles.roleId, roles.id))
        .leftJoin(rolesPermissions, eq(roles.id, rolesPermissions.roleId))
        .leftJoin(
          permissions,
          eq(permissions.id, rolesPermissions.permissionId),
        )
        .where(
          and(
            eq(projectsUsersRoles.projectId, projectId),
            eq(projectsUsersRoles.userId, userId),
          ),
        )
    ).map((p) => p.permission);
  }

  /**
   * Gets a project user relation.
   * @param projectId id of project
   * @param userId id of user
   * @returns The project and user if the relation exists
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  async getProjectsUsersRelation(projectId: number, userId: string) {
    const projectUserRelation = await dbClient.query.projectsUsers.findFirst({
      where: and(
        eq(projectsUsers.projectId, projectId),
        eq(projectsUsers.userId, userId),
      ),
      with: {
        project: true,
        user: true,
      },
    });
    if (projectUserRelation === undefined) {
      throw new RecordDoesNotExistError(
        `No relation exists between user with id: "${userId}" and project with id: "${projectId}".`,
      );
    }
    const { project, user } = projectUserRelation;
    return { project, user };
  }

  /**
   * Gets a project environment relation.
   * @param projectId id of project
   * @param environmentId id of environment
   * @param options extra options
   * @returns The project and environment relation
   * @throws A {@link RecordDoesNotExistError} if no relation exists
   */
  async getProjectsEnvironmentsRelation(
    projectId: number,
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
   * Removes a user from a project. Will not error if user is not a user on the project.
   * @param userId Id of user to remove
   */
  public async removeUserFromProject(projectId: number, userId: string) {
    await dbClient
      .delete(projectsUsersRoles)
      .where(
        and(
          eq(projectsUsersRoles.projectId, projectId),
          eq(projectsUsersRoles.userId, userId),
        ),
      );
    await dbClient
      .delete(projectsUsers)
      .where(
        and(
          eq(projectsUsers.projectId, projectId),
          eq(projectsUsers.userId, userId),
        ),
      );
  }

  /**
   * Archives a project.
   * @param projectId Id of project to be archived
   */
  public async archiveProject(projectId: number) {
    await dbClient
      .update(projects)
      .set({ isArchived: true, modifiedAt: new Date() })
      .where(eq(projects.id, projectId));
  }
}
