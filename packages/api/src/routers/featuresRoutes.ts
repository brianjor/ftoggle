import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { hooks } from '../hooks';

const featuresController = new FeaturesController();

const getFeautresRoute = new Elysia().use(hooks).get(
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
    beforeHandle: [({ isSignedIn }) => isSignedIn()],
  },
);

const createFeaturesRoute = new Elysia().use(hooks).post(
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
    beforeHandle: [({ isSignedIn }) => isSignedIn()],
  },
);

const getFeatureRoute = new Elysia().use(hooks).get(
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
    beforeHandle: [({ isSignedIn }) => isSignedIn()],
  },
);

export const featuresRoutes = new Elysia({ prefix: '/features' })
  .use(getFeautresRoute)
  .use(createFeaturesRoute)
  .use(getFeatureRoute);
