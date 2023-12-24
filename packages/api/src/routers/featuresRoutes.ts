import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { isSignedIn } from '../hooks/isSignedInHook';

const featuresController = new FeaturesController();

const getFeautresRoute = new Elysia().onBeforeHandle([isSignedIn]).get(
  '',
  async ({ set }) => {
    const features = await featuresController.getFeatures();
    const response = {
      data: {
        features,
      },
    };
    set.status = 200;
    return response;
  },
  {
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

const createFeaturesRoute = new Elysia().onBeforeHandle([isSignedIn]).post(
  '',
  async ({ set, body }) => {
    const name = body.name;
    await featuresController.addFeature(name);
    set.status = 200;
    return 'Successfully added feature!';
  },
  {
    body: t.Object({
      name: t.String(),
    }),
    response: {
      200: t.String(),
    },
  },
);

const getFeatureRoute = new Elysia().onBeforeHandle([isSignedIn]).get(
  '/:featureId',
  async ({ set, params }) => {
    const featureId = params.featureId;
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
