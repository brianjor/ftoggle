import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { getUserByUsername } from '../controllers/usersController';
import { ProjectPermission } from '../enums/permissions';
import { ProjectRole } from '../enums/roles';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();

export const projectUsersHandlers = new Elysia().use(hooks).post(
  '',
  async (context) => {
    const { params, body } = context;
    const projectId = params.projectId;
    const { username, role } = body;
    const project = await projectsController.getProjectById(projectId);
    const newProjectUser = await getUserByUsername(username);

    await projectsController.addUser(projectId, newProjectUser.id);
    await projectsController.addRoleToUser(projectId, newProjectUser.id, role);

    return `Added user: "${username}" with role "${role}" to project: "${project?.name}"`;
  },
  {
    params: t.Object({
      projectId: t.Numeric(),
    }),
    body: t.Object({
      username: t.String(),
      role: t.Enum(ProjectRole, {
        error: `Expected one of [${Object.values(ProjectRole).join(', ')}]`,
      }),
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
        hasProjectPermissions(projectsController, [ProjectPermission.ADD_USER]),
    ],
  },
);
