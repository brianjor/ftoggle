import { dbClient } from '@ftoggle/db/connection';
import {
  environments,
  projects,
  projectsUsers,
  projectsUsersRoles,
  roles,
  users,
} from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';
import { ProjectRole } from '../enums/roles';

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

  public async getProject(projectId: number) {
    const result = await dbClient.query.projects.findMany({
      where: eq(projects.id, projectId),
      with: {
        features: true,
      },
    });
    return result.pop();
  }

  public async createProject(projectName: string) {
    return (
      await dbClient.insert(projects).values({ name: projectName }).returning()
    )[0];
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
}
