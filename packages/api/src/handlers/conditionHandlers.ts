import {
  DateOperators,
  DateOperatorsValues,
  MultiValueOperators,
  MultiValueOperatorsValues,
  NumericOperators,
  NumericOperatorsValues,
  SingleValueStringOperators,
  SingleValueStringOperatorsValues,
} from '@ftoggle/common/enums/operators';
import { conditionsFieldValuesReqs } from '@ftoggle/common/validations/conditionsValidations';
import { Elysia, t } from 'elysia';
import { ConditionsController } from '../controllers/conditionsController';
import { ContextFieldController } from '../controllers/contextFieldController';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { BadRequestError } from '../errors/apiErrors';
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
      const contextField = await new ContextFieldController().getContextField(
        condition.contextFieldId,
      );
      const newOperator = body.operator;

      const tryingToChangeFromDateOperator =
        contextField.name === 'currentTime' &&
        !DateOperatorsValues.includes(newOperator);
      if (tryingToChangeFromDateOperator) {
        throw new BadRequestError(
          '"currentTime" can only be used with date operators',
        );
      }
      const tryingToChangeToDateOperator =
        DateOperatorsValues.includes(newOperator) &&
        contextField.name != 'currentTime';
      if (tryingToChangeToDateOperator) {
        throw new BadRequestError(
          'Only "currentTime" can be used with date operators',
        );
      }

      if ('value' in body) {
        await conditionsController.patchCondition(
          condition,
          newOperator,
          body.value,
          undefined,
        );
      } else if ('values' in body) {
        await conditionsController.patchCondition(
          condition,
          newOperator,
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
        t.Union([
          t.Object({
            operator: t.Enum(NumericOperators, {
              error: `operator: Expected one of [${NumericOperatorsValues.join(', ')}]`,
              examples: NumericOperatorsValues,
            }),
            value: t.String({
              maxLength: conditionsFieldValuesReqs.maxLength,
              pattern: '^\\d+$',
              default: '0', // TODO: Remove once https://github.com/elysiajs/elysia/issues/514 is resolved
            }),
          }),
          t.Object({
            operator: t.Enum(DateOperators, {
              error: `operator: Expected one of [${DateOperatorsValues.join(', ')}]`,
              examples: DateOperatorsValues,
            }),
            value: t.String({
              maxLength: conditionsFieldValuesReqs.maxLength,
              format: 'date-time',
            }),
          }),
          t.Object({
            operator: t.Enum(SingleValueStringOperators, {
              error: `operator: Expected one of [${SingleValueStringOperatorsValues.join(', ')}]`,
              examples: SingleValueStringOperatorsValues,
            }),
            value: t.String({
              maxLength: conditionsFieldValuesReqs.maxLength,
            }),
          }),
        ]),
        // Conditions that support multiple values
        t.Object({
          operator: t.Enum(MultiValueOperators, {
            error: `operator: Expected one of [${MultiValueOperatorsValues.join(', ')}]`,
            examples: MultiValueOperatorsValues,
          }),
          values: t.Array(
            t.String({
              maxLength: conditionsFieldValuesReqs.maxLength,
            }),
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
