import { Elysia, t } from 'elysia';
import { ConditionsController } from '../controllers/conditionsController';
import { EnvironmentsController } from '../controllers/environmentsController';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController();
const environmentsController = new EnvironmentsController();
const conditionsController = new ConditionsController();

export const conditionHandlers = new Elysia().use(hooks).delete(
  '',
  async ({ params }) => {
    const { projectId, featureId, environmentId, conditionId } = params;
    await projectsController.getProjectById(projectId);
    await featuresController.getProjectFeatureById(projectId, featureId);
    await environmentsController.getEnvironmentById(environmentId);

    await conditionsController.deleteConditionById(conditionId);

    return new Response(null, { status: 204 });
  },
  {
    response: {
      204: t.Null(),
    },
    params: t.Object({
      projectId: t.String(),
      featureId: t.Numeric(),
      environmentId: t.Numeric(),
      conditionId: t.String(),
    }),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions }) =>
        hasUserPermissions([UserPermission.DELETE_FEATURE_TOGGLE_CONDITION]),
    ],
  },
);
