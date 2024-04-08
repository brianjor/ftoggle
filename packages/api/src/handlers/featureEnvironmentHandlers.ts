import Elysia, { t } from 'elysia';
import { FeaturesEnvironmentsController } from '../controllers/featuresEnvironmentsController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { featuresEnvironmentsTableItem } from '../typeboxes/featuresEnvironmentsTypes';

const featuresEnvironmentsController = new FeaturesEnvironmentsController();
const projectsController = new ProjectsController();

export const toggleFeatureDataContract = t.Object({
  relation: featuresEnvironmentsTableItem,
});

export const featureEnvironmentHandler = new Elysia().use(hooks).put(
  '',
  async ({ params }) => {
    const { projectId, featureName, environmentName } = params;
    await projectsController.getProjectById(projectId);
    await featuresEnvironmentsController.getProjectFeatureEnvironmentRelation(
      projectId,
      featureName,
      environmentName,
    );

    const relation = await featuresEnvironmentsController.toggleFeature(
      projectId,
      featureName,
      environmentName,
    );

    return {
      relation,
    };
  },
  {
    params: t.Object({
      projectId: t.String(),
      featureName: t.String(),
      environmentName: t.String(),
    }),
    response: toggleFeatureDataContract,
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions }) =>
        hasUserPermissions([UserPermission.EDIT_FEATURE_TOGGLE]),
    ],
  },
);
