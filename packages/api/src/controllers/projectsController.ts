import { dbClient } from '@ftoggle/db/connection';
import {
  environments,
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
      .set({ name: updateFields.name })
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

  public async addEnvironment(envName: string, projectId: number) {
    return (
      await dbClient
        .insert(environments)
        .values({ name: envName, projectId })
        .returning()
    )[0];
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
}
