import Elysia, { t } from 'elysia';
import { ApiTokensController } from '../controllers/apiTokensController';
import { ProjectPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const apiTokensController = new ApiTokensController();

export const apiTokenHandlers = new Elysia().use(hooks).delete(
  '',
  async ({ params }) => {
    const { apiTokenId } = params;

    await apiTokensController.deleteApiTokenById(apiTokenId);

    return {
      message: `Deleted API token with id: ${apiTokenId}`,
    };
  },
  {
    response: {
      200: t.Object({
        message: t.String(),
      }),
    },
    params: t.Object({
      projectId: t.String(),
      apiTokenId: t.String({ format: 'uuid' }),
    }),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasProjectPermissions }) =>
        hasProjectPermissions([ProjectPermission.DELETE_API_TOKEN]),
    ],
  },
);
