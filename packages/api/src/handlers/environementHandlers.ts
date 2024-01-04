import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();

export const environmentHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async ({ params }) => {
      const { projectId, environmentId } = params;
      const env = await projectsController.getEnvironmentById(
        projectId,
        environmentId,
      );
      return {
        data: {
          environment: env,
        },
      };
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
        environmentId: t.Numeric(),
      }),
      response: {
        200: t.Object({
          data: t.Object({
            environment: t.Object({
              id: t.Number(),
              name: t.String(),
              createdAt: t.Date(),
              modifiedAt: t.Date(),
              projectId: t.Number(),
            }),
          }),
        }),
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasProjectPermissions }) =>
          hasProjectPermissions([ProjectPermission.VIEW_ENVIRONMENTS]),
      ],
    },
  )
  .delete(
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
          hasProjectPermissions([ProjectPermission.DELETE_ENVIRONMENT]),
      ],
    },
  );
