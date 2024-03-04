import { Operators, OperatorsValues } from '@ftoggle/common/enums/operators';
import {
  conditionsFieldDescriptionReqs,
  conditionsFieldValuesReqs,
} from '@ftoggle/common/validations/conditionsValidations';
import { contextFieldNameReqs } from '@ftoggle/common/validations/contextFieldsValidations';
import { Elysia, t } from 'elysia';
import { ConditionsController } from '../controllers/conditionsController';
import { EnvironmentsController } from '../controllers/environmentsController';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const conditionsController = new ConditionsController();
const projectsController = new ProjectsController();
const featuresController = new FeaturesController();
const environmentsController = new EnvironmentsController();

export const conditionsHandlers = new Elysia().use(hooks).post(
  '',
  async ({ params, body }) => {
    const { environmentId, featureId, projectId } = params;
    const { conditions } = body;

    await projectsController.getProjectById(projectId);
    await featuresController.getProjectFeatureById(projectId, featureId);
    await environmentsController.getEnvironmentById(environmentId);

    await conditionsController.createConditions(
      conditions,
      projectId,
      featureId,
      environmentId,
    );
  },
  {
    params: t.Object({
      projectId: t.String(),
      featureId: t.Numeric(),
      environmentId: t.Numeric(),
    }),
    body: t.Object({
      conditions: t.Array(
        t.Object({
          contextName: t.String({
            maxLength: contextFieldNameReqs.maxLength,
          }),
          operator: t.Enum(Operators, {
            error: `operator: Expected one of [${OperatorsValues.join(', ')}]`,
          }),
          description: t.Optional(
            t.String({
              maxLength: conditionsFieldDescriptionReqs.maxLength,
            }),
          ),
          values: t.Array(
            t.String({
              maxLength: conditionsFieldValuesReqs.maxLength,
            }),
          ),
        }),
      ),
    }),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions }) =>
        hasUserPermissions([UserPermission.CREATE_FEATURE_TOGGLE_CONDITION]),
    ],
  },
);
