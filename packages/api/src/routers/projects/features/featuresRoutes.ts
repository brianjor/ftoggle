import Elysia, { t } from 'elysia';
import { FeaturesController } from '../../../controllers/featuresController';
import { hooks } from '../../../hooks';
import { isSignedIn } from '../../../hooks/isSignedInHook';

const featuresController = new FeaturesController();

const getFeautresRoute = new Elysia()
  .use(hooks)
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
                enabled: t.Boolean(),
                createdAt: t.Date(),
                modifiedAt: t.Date(),
              }),
            ),
          }),
        }),
      },
    },
  );

const createFeaturesRoute = new Elysia()
  .use(hooks)
  .derive(isSignedIn)
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

const getFeatureRoute = new Elysia()
  .use(hooks)
  .derive(isSignedIn)
  .get(
    '/:featureId',
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
              enabled: t.Boolean(),
              createdAt: t.Date(),
              modifiedAt: t.Date(),
            }),
          }),
        }),
        404: t.String(),
      },
    },
  );

export const featuresRoutes = new Elysia({ prefix: '/features' })
  .use(getFeautresRoute)
  .use(createFeaturesRoute)
  .use(getFeatureRoute);
