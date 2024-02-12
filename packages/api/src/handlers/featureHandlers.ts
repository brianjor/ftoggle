import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { featuresTableItem } from '../typeboxes/featuresTypes';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

export const featureHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async ({ set, params }) => {
      const { projectId, featureId } = params;
      const feature = await featuresController.getProjectFeatureById(
        projectId,
        featureId,
      );
      const response = {
        data: {
          feature,
        },
      };
      set.status = 200;
      return response;
    },
    {
      params: t.Object({
        projectId: t.String(),
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
      const { projectId, featureId } = params;
      await projectsController.getProjectById(projectId);
      await featuresController.getProjectFeatureById(projectId, featureId);

      const updatedFeature = await featuresController.updateFeature(
        featureId,
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
        featureId: t.Numeric(),
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
      const { projectId, featureId } = params;
      await featuresController.deleteProjectFeature(featureId, projectId);

      return {
        message: 'Feature deleted',
      };
    },
    {
      params: t.Object({
        projectId: t.String(),
        featureId: t.Numeric(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.DELETE_FEATURE_TOGGLE]),
      ],
    },
  );
