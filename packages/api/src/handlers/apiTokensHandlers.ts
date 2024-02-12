import { ApiTokenType } from '@ftoggle/common/enums/apiTokens';
import Elysia, { t } from 'elysia';
import { ApiTokensController } from '../controllers/apiTokensController';
import { EnvironmentsController } from '../controllers/environmentsController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { apiTokensTableItem } from '../typeboxes/apiTokensTypes';

const projectsController = new ProjectsController();
const environmentsController = new EnvironmentsController();
const apiTokensController = new ApiTokensController();

export const apiTokensHandlers = new Elysia()
  .use(hooks)
  .post(
    '',
    async ({ body, params, getRequestUser }) => {
      const { projectId } = params;
      const { environmentId, type, name } = body;
      const { user } = await getRequestUser();
      await projectsController.getProjectById(projectId);
      await environmentsController.getEnvironmentById(environmentId);
      const apiToken = await apiTokensController.createApiToken({
        projectId,
        environmentId,
        type,
        name,
        userId: user.id,
      });

      return {
        apiToken,
      };
    },
    {
      response: {
        200: t.Object({ apiToken: apiTokensTableItem }),
      },
      params: t.Object({ projectId: t.String() }),
      body: t.Object({
        environmentId: t.Number(),
        type: t.Enum(ApiTokenType),
        name: t.String(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.CREATE_PROJECT_API_TOKEN]),
      ],
    },
  )
  .get(
    '',
    async ({ params }) => {
      const { projectId } = params;
      await projectsController.getProjectById(projectId);

      const tokens =
        await apiTokensController.getApiTokensForProject(projectId);

      return {
        tokens,
      };
    },
    {
      response: {
        200: t.Object({
          tokens: t.Array(apiTokensTableItem),
        }),
      },
      params: t.Object({
        projectId: t.String(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.VIEW_PROJECT_API_TOKENS]),
      ],
    },
  );
