import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { UsersController } from '../controllers/usersController';
import { ProjectPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();
const usersController = new UsersController();

export const projectUserHandlers = new Elysia().use(hooks).delete(
  '',
  async (context) => {
    const { params } = context;
    const { projectId, userId } = params;
    const project = await projectsController.getProjectById(projectId);
    const userToRemove = await usersController.getUserById(userId);

    await projectsController.removeUserFromProject(projectId, userId);

    return `Removed user: "${userToRemove.username}" from project: "${project.name}"`;
  },
  {
    params: t.Object({
      projectId: t.Numeric(),
      userId: t.String(),
    }),
    response: {
      200: t.String(),
      401: t.String(),
      403: t.String(),
      404: t.String(),
    },
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasProjectPermissions }) =>
        hasProjectPermissions([ProjectPermission.REMOVE_USER]),
    ],
  },
);
