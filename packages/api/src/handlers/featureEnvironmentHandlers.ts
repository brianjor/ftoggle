import Elysia, { t } from 'elysia';
import { FeaturesEnvironmentsController } from '../controllers/featuresEnvironmentsController';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
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
    const { projectId, featureId, environmentId } = params;
    await projectsController.getProjectById(projectId);
    await featuresEnvironmentsController.getRelation(
      featureId,
      environmentId,
      projectId,
    );

    const relation = await featuresEnvironmentsController.toggleFeature(
      featureId,
      environmentId,
      projectId,
    );

    return {
      relation,
    };
  },
  {
    params: t.Object({
      projectId: t.String(),
      featureId: t.Numeric(),
      environmentId: t.Numeric(),
    }),
    response: toggleFeatureDataContract,
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasProjectPermissions }) =>
        hasProjectPermissions([ProjectPermission.EDIT_FEATURE_TOGGLE]),
    ],
  },
);
