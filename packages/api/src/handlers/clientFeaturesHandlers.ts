import Elysia, { t } from 'elysia';
import { ApiTokensController } from '../controllers/apiTokensController';
import { ClientController } from '../controllers/clientController';
import { AuthenticationError } from '../errors/apiErrors';
import { hooks } from '../hooks';

const apiTokensController = new ApiTokensController();
const clientController = new ClientController();
const authHeaderPattern =
  '^[a-zA-Z0-9_%-]*:[a-zA-Z0-9_%-]*:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

export const clientFeaturesHandler = new Elysia().use(hooks).get(
  '',
  async ({ headers }) => {
    const authHeader = headers.authorization;

    if (authHeader === undefined || authHeader === null) {
      throw new AuthenticationError('Missing authorization header');
    }
    if (!RegExp(authHeaderPattern).test(authHeader))
      throw new AuthenticationError(
        `Authorization header must be in the following format: ${authHeaderPattern}`,
      );

    const [projectId, environmentName, apiTokenId] = authHeader.split(':');
    const apiToken = await apiTokensController.getApiTokenById(apiTokenId);

    if (apiToken.projectId !== projectId) {
      throw new AuthenticationError('Invalid projectId for this API token');
    }
    if (apiToken.environment.name !== environmentName) {
      throw new AuthenticationError(
        'Invalid environment name for this API token',
      );
    }

    return {
      features: await clientController.getFeatures(
        projectId,
        apiToken.environment.id,
      ),
    };
  },
  {
    headers: t.Object({
      authorization: t.String({ pattern: authHeaderPattern }),
    }),
    response: {
      200: t.Object({
        features: t.Array(
          t.Object({
            name: t.String(),
            isEnabled: t.Boolean(),
          }),
        ),
      }),
    },
  },
);
