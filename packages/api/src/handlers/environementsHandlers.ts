import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();

export const environmentsHandlers = new Elysia().use(hooks).post(
  '',
  async ({ params, body }) => {
    const { projectId } = params;
    const { environmentName } = body;
    const project = await projectsController.getProjectById(projectId);

    const env = await projectsController.addEnvironment(
      environmentName,
      projectId,
    );

    return `Created environment: "${env.name}" for project: "${project.name}"`;
  },
  {
    params: t.Object({
      projectId: t.Numeric(),
    }),
    body: t.Object({
      environmentName: t.String(),
    }),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasProjectPermissions }) =>
        hasProjectPermissions(projectsController, [
          ProjectPermission.CREATE_ENVIRONMENT,
        ]),
    ],
  },
);
