import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { environmentsTableItem } from '../typeboxes/environmentTypes';

const projectsController = new ProjectsController();

export const environmentHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async ({ params }) => {
      const { projectId, environmentName } = params;
      const env = await projectsController.getProjectEnvironment(
        projectId,
        environmentName,
      );
      return {
        data: {
          environment: env,
        },
      };
    },
    {
      params: t.Object({
        projectId: t.String(),
        environmentName: t.String(),
      }),
      response: {
        200: t.Object({
          data: t.Object({
            environment: environmentsTableItem,
          }),
        }),
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.VIEW_ENVIRONMENTS]),
      ],
    },
  )
  .delete(
    '',
    async ({ params }) => {
      const { projectId, environmentName } = params;
      const { project, ...environment } =
        await projectsController.getProjectsEnvironmentsRelation(
          projectId,
          environmentName,
        );
      await projectsController.deleteEnvironment(projectId, environmentName);

      return `Deleted environment: "${environment.name}" from project: "${project.name}"`;
    },
    {
      params: t.Object({
        projectId: t.String(),
        environmentName: t.String(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.DELETE_ENVIRONMENT]),
      ],
    },
  );
