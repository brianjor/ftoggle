import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { featuresTableItem } from '../typeboxes/featuresTypes';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController();

export const featureHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async ({ params }) => {
      const { projectId, featureName } = params;
      const feature = await featuresController.getProjectFeature(
        projectId,
        featureName,
      );
      const response = {
        data: {
          feature,
        },
      };
      return response;
    },
    {
      params: t.Object({
        projectId: t.String(),
        featureName: t.String(),
      }),
      response: {
        200: t.Object({
          data: t.Object({
            feature: featuresTableItem,
          }),
        }),
        404: t.String(),
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.VIEW_FEATURE_TOGGLES]),
      ],
    },
  )
  .put(
    '',
    async ({ body, params }) => {
      const { projectId, featureName } = params;
      await projectsController.getProjectById(projectId);
      await featuresController.getProjectFeature(projectId, featureName);

      const updatedFeature = await featuresController.updateFeature(
        featureName,
        projectId,
        {
          name: body.name,
        },
      );

      return { updatedFeature };
    },
    {
      params: t.Object({
        projectId: t.String(),
        featureName: t.String(),
      }),
      body: t.Object(
        {
          name: t.Optional(t.String()),
        },
        { additionalProperties: false },
      ),
      response: {
        200: t.Object({
          updatedFeature: featuresTableItem,
        }),
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.EDIT_FEATURE_TOGGLE]),
      ],
    },
  )
  .delete(
    '',
    async ({ params }) => {
      const { projectId, featureName } = params;
      await featuresController.deleteProjectFeature(featureName, projectId);

      return {
        message: 'Feature deleted',
      };
    },
    {
      params: t.Object({
        projectId: t.String(),
        featureName: t.String(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.DELETE_FEATURE_TOGGLE]),
      ],
    },
  );
