import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();

export const environmentHandlers = new Elysia().use(hooks).delete(
  '',
  async ({ params }) => {
    const { projectId, environmentId } = params;
    const project = await projectsController.getProjectById(projectId);
    const env = await projectsController.deleteEnvironment(
      projectId,
      environmentId,
    );

    return `Deleted environment: "${env.name}" from project: "${project.name}"`;
  },
  {
    params: t.Object({
      projectId: t.Numeric(),
      environmentId: t.Numeric(),
    }),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasProjectPermissions }) =>
        hasProjectPermissions(projectsController, [
          ProjectPermission.DELETE_ENVIRONMENT,
        ]),
    ],
  },
);
