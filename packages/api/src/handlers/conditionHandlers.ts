import {
  MultiValueOperators,
  SingleValueOperators,
} from '@ftoggle/common/enums/operators';
import { conditionsFieldValuesReqs } from '@ftoggle/common/validations/conditionsValidations';
import { Elysia, t } from 'elysia';
import { ConditionsController } from '../controllers/conditionsController';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController();
const conditionsController = new ConditionsController();

export const conditionHandlers = new Elysia()
  .use(hooks)
  .patch(
    '',
    async ({ body, params }) => {
      const { projectId, featureName, environmentName, conditionId } = params;
      await projectsController.getProjectById(projectId);
      await featuresController.getProjectFeature(projectId, featureName);
      await projectsController.getProjectEnvironment(
        projectId,
        environmentName,
      );
      const condition =
        await conditionsController.getConditionById(conditionId);

      if ('value' in body) {
        await conditionsController.patchCondition(
          condition,
          body.operator,
          body.value,
          undefined,
        );
      } else if ('values' in body) {
        await conditionsController.patchCondition(
          condition,
          body.operator,
          undefined,
          body.values,
        );
      }
    },
    {
      params: t.Object({
        projectId: t.String(),
        featureName: t.String(),
        environmentName: t.String(),
        conditionId: t.String(),
      }),
      body: t.Union([
        t.Object({
          operator: t.Enum(SingleValueOperators),
          value: t.String({ maxLength: conditionsFieldValuesReqs.maxLength }),
        }),
        t.Object({
          operator: t.Enum(MultiValueOperators),
          values: t.Array(
            t.String({ maxLength: conditionsFieldValuesReqs.maxLength }),
          ),
        }),
      ]),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.EDIT_FEATURE_TOGGLE_CONDITION]),
      ],
    },
  )
  .delete(
    '',
    async ({ params }) => {
      const { projectId, featureName, environmentName, conditionId } = params;
      await projectsController.getProjectById(projectId);
      await featuresController.getProjectFeature(projectId, featureName);
      await projectsController.getProjectEnvironment(
        projectId,
        environmentName,
      );

      await conditionsController.deleteConditionById(conditionId);

      return new Response(null, { status: 204 });
    },
    {
      response: {
        204: t.Null(),
      },
      params: t.Object({
        projectId: t.String(),
        featureName: t.String(),
        environmentName: t.String(),
        conditionId: t.String(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.DELETE_FEATURE_TOGGLE_CONDITION]),
      ],
    },
  );
