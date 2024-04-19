import {
  MultiValueOperators,
  MultiValueOperatorsValues,
  SingleValueOperators,
  SingleValueOperatorsValues,
} from '@ftoggle/common/enums/operators';
import {
  conditionsFieldDescriptionReqs,
  conditionsFieldValuesReqs,
} from '@ftoggle/common/validations/conditionsValidations';
import { contextFieldNameReqs } from '@ftoggle/common/validations/contextFieldsValidations';
import { Elysia, t } from 'elysia';
import { ConditionsController } from '../controllers/conditionsController';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const conditionsController = new ConditionsController();
const projectsController = new ProjectsController();
const featuresController = new FeaturesController();

const postConditionBodyType = t.Object({
  conditions: t.Array(
    // Conditions can support either a single value or multiple values
    t.Union([
      // Conditions that support a single value
      t.Object({
        contextName: t.String({
          maxLength: contextFieldNameReqs.maxLength,
        }),
        description: t.Optional(
          t.String({
            maxLength: conditionsFieldDescriptionReqs.maxLength,
          }),
        ),
        operator: t.Enum(SingleValueOperators, {
          error: `operator: Expected one of [${SingleValueOperatorsValues.join(', ')}]`,
        }),
        value: t.String({
          maxLength: conditionsFieldValuesReqs.maxLength,
        }),
      }),
      // Conditions that support multiple values
      t.Object({
        contextName: t.String({
          maxLength: contextFieldNameReqs.maxLength,
        }),
        description: t.Optional(
          t.String({
            maxLength: conditionsFieldDescriptionReqs.maxLength,
          }),
        ),
        operator: t.Enum(MultiValueOperators, {
          error: `operator: Expected one of [${MultiValueOperatorsValues.join(', ')}]`,
        }),
        values: t.Array(
          t.String({
            maxLength: conditionsFieldValuesReqs.maxLength,
          }),
        ),
      }),
    ]),
  ),
});

export const conditionsHandlers = new Elysia()
  .use(hooks)
  .post(
    '',
    async ({ params, body }) => {
      const { environmentName, featureName, projectId } = params;
      const { conditions } = body;

      await projectsController.getProjectById(projectId);
      await featuresController.getProjectFeature(projectId, featureName);
      const env = await projectsController.getProjectEnvironment(
        projectId,
        environmentName,
      );

      await conditionsController.createConditions(
        conditions,
        projectId,
        featureName,
        env.id,
      );
    },
    {
      params: t.Object({
        projectId: t.String(),
        featureName: t.String(),
        environmentName: t.String(),
      }),
      body: postConditionBodyType,
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.CREATE_FEATURE_TOGGLE_CONDITION]),
      ],
    },
  )
  .get(
    '',
    async ({ params }) => {
      const { projectId, featureName, environmentName } = params;
      await projectsController.getProjectById(projectId);
      await featuresController.getProjectFeature(projectId, featureName);
      const env = await projectsController.getProjectEnvironment(
        projectId,
        environmentName,
      );

      const conditions =
        await conditionsController.getProjectFeatureEnvironmentConditions(
          projectId,
          featureName,
          env.id,
        );
      return {
        conditions,
      };
    },
    {
      params: t.Object({
        projectId: t.String(),
        featureName: t.String(),
        environmentName: t.String(),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.VIEW_FEATURE_TOGGLE_CONDITIONS]),
      ],
    },
  );
