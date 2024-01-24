import Elysia, { t } from 'elysia';
import { ApiTokensController } from '../controllers/apiTokensController';
import { EnvironmentsController } from '../controllers/environmentsController';
import { ProjectsController } from '../controllers/projectsController';
import { ApiTokenType } from '../enums/apiTokens';
import { ProjectPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { apiTokensTableItem } from '../typeboxes/apiTokensTypes';

const projectsController = new ProjectsController();
const environmentsController = new EnvironmentsController();
const apiTokensController = new ApiTokensController();

export const apiTokensHandlers = new Elysia().use(hooks).post(
  '',
  async ({ body, params, getRequestUser }) => {
    const { projectId } = params;
    const { environmentId, type, name } = body;
    const user = await getRequestUser();
    await projectsController.getProjectById(projectId);
    await environmentsController.getEnvironmentById(environmentId);
    const apiToken = await apiTokensController.createApiToken({
      projectId,
      environmentId,
      type,
      name,
      userId: user.userId,
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
      ({ hasProjectPermissions }) =>
        hasProjectPermissions([ProjectPermission.CREATE_API_TOKEN]),
    ],
  },
);
