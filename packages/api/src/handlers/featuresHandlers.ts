import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { featureWithEnvironments } from '../typeboxes/featuresTypes';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

const getResponse = t.Object({
  features: t.Array(featureWithEnvironments),
});

export const featuresHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async ({ params }) => {
      const { projectId } = params;
      const features = await featuresController.getFeatures(projectId);
      const response = { features };
      return response;
    },
    {
      params: t.Object({
        projectId: t.String(),
      }),
      response: {
        200: getResponse,
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.VIEW_FEATURE_TOGGLES]),
      ],
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
        projectId: t.String(),
      }),
      body: t.Object({
        name: t.String(),
      }),
      response: {
        200: t.String(),
      },
      beforeHandle: [({ isSignedIn }) => isSignedIn()],
    },
  );
