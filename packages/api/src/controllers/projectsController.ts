import { dbClient } from '@ftoggle/db/connection';
import { projects, projectsUsers, users } from '@ftoggle/db/schema';
import { eq } from 'drizzle-orm';

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
}
