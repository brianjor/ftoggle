import { Elysia, t } from 'elysia';
import { ConditionsController } from '../controllers/conditionsController';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController();
const conditionsController = new ConditionsController();

export const conditionHandlers = new Elysia().use(hooks).delete(
  '',
  async ({ params }) => {
    const { projectId, featureName, environmentName, conditionId } = params;
    await projectsController.getProjectById(projectId);
    await featuresController.getProjectFeature(projectId, featureName);
    await projectsController.getProjectEnvironment(projectId, environmentName);

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
