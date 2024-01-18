import Elysia, { Static, t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { hooks } from '../hooks';
import { environmentsTableItem } from '../typeboxes/environmentTypes';
import { featuresEnvironmentsTableItem } from '../typeboxes/featuresEnvironmentsTypes';
import { featuresTableItem } from '../typeboxes/featuresTypes';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

const getResponse = t.Object({
  features: t.Array(
    t.Composite([
      featuresTableItem,
      t.Object({
        environments: t.Array(
          t.Composite([
            featuresEnvironmentsTableItem,
            t.Object({
              environment: environmentsTableItem,
            }),
          ]),
        ),
      }),
    ]),
  ),
});

export type GetProjectFeatures = Static<typeof getResponse.properties.features>;

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
        projectId: t.Numeric(),
      }),
      response: {
        200: getResponse,
      },
      beforeHandle: [({ isSignedIn }) => isSignedIn()],
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
      beforeHandle: [({ isSignedIn }) => isSignedIn()],
    },
  );
