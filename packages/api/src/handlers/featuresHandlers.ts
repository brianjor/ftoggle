import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { isSignedIn } from '../hooks/isSignedInHook';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

export const featuresHandlers = new Elysia()
  .derive(isSignedIn)
  .get(
    '',
    async ({ set, params }) => {
      const { projectId } = params;
      const features = await featuresController.getFeatures(projectId);
      const response = {
        data: {
          features,
        },
      };
      set.status = 200;
      return response;
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      response: {
        200: t.Object({
          data: t.Object({
            features: t.Array(
              t.Object({
                id: t.Number(),
                name: t.String(),
                isEnabled: t.Boolean(),
                createdAt: t.Date(),
                modifiedAt: t.Date(),
              }),
            ),
          }),
        }),
      },
    },
  )
  .post(
    '',
    async ({ set, body, params }) => {
      const { name } = body;
      const { projectId } = params;
      await featuresController.addFeature(name, projectId);
      set.status = 200;
      return 'Successfully added feature!';
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      body: t.Object({
        name: t.String(),
      }),
      response: {
        200: t.String(),
      },
    },
  );
