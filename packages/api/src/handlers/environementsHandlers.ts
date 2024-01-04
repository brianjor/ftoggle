import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();

export const environmentsHandlers = new Elysia()
  .use(hooks)
  .post(
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
          hasProjectPermissions([ProjectPermission.CREATE_ENVIRONMENT]),
      ],
    },
  )
  .get(
    '',
    async ({ params }) => {
      const { projectId } = params;

      return {
        data: {
          environments: await projectsController.getEnvironments(projectId),
        },
      };
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasProjectPermissions }) =>
          hasProjectPermissions([ProjectPermission.VIEW_ENVIRONMENTS]),
      ],
    },
  );
