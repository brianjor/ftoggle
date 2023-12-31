import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { hooks } from '../hooks';
import { isSignedIn } from '../hooks/isSignedInHook';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

export const featureHandlers = new Elysia()
  .use(hooks)
  .derive(isSignedIn)
  .get(
    '',
    async ({ set, params }) => {
      const { featureId } = params;
      const feature = await featuresController.getFeature(featureId);
      const response = {
        data: {
          feature: feature[0],
        },
      };
      set.status = 200;
      return response;
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
        featureId: t.Numeric(),
      }),
      response: {
        200: t.Object({
          data: t.Object({
            feature: t.Object({
              id: t.Number(),
              name: t.String(),
              isEnabled: t.Boolean(),
              createdAt: t.Date(),
              modifiedAt: t.Date(),
            }),
          }),
        }),
        404: t.String(),
      },
    },
  );
