import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
import {
  BadRequestResponse,
  ForbiddenResponse,
  UnathorizedResponse,
} from '../helpers/responses';
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
        projectId: t.String(),
      }),
      body: t.Object({
        environmentName: t.String(),
      }),
      response: {
        200: t.String(),
        400: BadRequestResponse,
        401: UnathorizedResponse,
        403: ForbiddenResponse,
      },
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
        projectId: t.String(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasProjectPermissions }) =>
          hasProjectPermissions([ProjectPermission.VIEW_ENVIRONMENTS]),
      ],
    },
  );
