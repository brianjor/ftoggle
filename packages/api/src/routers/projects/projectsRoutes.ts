import Elysia, { t } from 'elysia';
import { FeaturesController } from '../../controllers/featuresController';
import { ProjectsController } from '../../controllers/projectsController';
import { EPermissions, ProjectPermission } from '../../enums/permissions';
import { ProjectRole } from '../../enums/roles';
import { RecordDoesNotExistError } from '../../errors/dbErrors';
import { hooks } from '../../hooks';
import { isSignedIn } from '../../hooks/isSignedInHook';
import { featuresRoutes } from './features/featuresRoutes';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

const getProjectsRoute = new Elysia()
  .use(hooks)
  .derive(isSignedIn)
  .get(
    '',
    async (context) => {
      const user = context.store.user;
      const projects = await projectsController.getProjects(user.userId);

      return {
        data: {
          projects,
        },
      };
    },
    {
      response: t.Object({
        data: t.Object({
          projects: t.Array(
            t.Object({
              name: t.String(),
            }),
          ),
        }),
      }),
    },
  );

const getProjectRoute = new Elysia().derive(isSignedIn).get(
  '/:projectId',
  async (context) => {
    const { projectId } = context.params;
    const project = await projectsController.getProject(projectId);
    if (project === undefined) {
      throw new RecordDoesNotExistError(
        `Project with id: ${projectId} does not exist.`,
      );
    }
    return {
      data: {
        project,
      },
    };
  },
  {
    params: t.Object({
      projectId: t.Numeric(),
    }),
    response: t.Object({
      data: t.Object({
        project: t.Object({
          id: t.Number(),
          name: t.String(),
        }),
      }),
    }),
  },
);

const createProjectRoute = new Elysia()
  .use(hooks)
  .derive(isSignedIn)
  .post(
    '',
    async (context) => {
      console.log('in POST /projects');
      const { store, body } = context;
      const user = store.user;
      const projectName = body.projectName;
      const project = await projectsController.createProject(projectName);
      await projectsController.addUser(project.id, user.userId);
      await projectsController.addRoleToUser(
        project.id,
        user.userId,
        ProjectRole.OWNER,
      );
      await projectsController.addEnvironment('dev', project.id);
      await projectsController.addEnvironment('prod', project.id);
      await featuresController.addFeature('feature', project.id);
      return project;
    },
    {
      body: t.Object({
        projectName: t.String(),
      }),
      beforeHandle: [
        ({ hasPermissions }) => hasPermissions([EPermissions.CREATE_PROJECT])(),
      ],
    },
  );

const updateProjectRoute = new Elysia()
  .use(hooks)
  .derive(isSignedIn)
  .put(
    '',
    async (context) => {
      const { body, params } = context;
      const { projectId } = params;
      const updateFields = {
        name: body.name,
      };
      await projectsController.updateProject(projectId, updateFields);
    },
    {
      body: t.Object({
        name: t.String({ optional: true }),
      }),
      beforeHandle: [
        ({ hasProjectPermissions }) =>
          hasProjectPermissions(projectsController, [
            ProjectPermission.EDIT_PROJECT,
          ])(),
      ],
    },
  );

export const projectsRoutes = new Elysia({ prefix: '/projects' })
  .use(
    new Elysia({ prefix: '/:projectId' })
      .use(featuresRoutes)
      .use(updateProjectRoute),
  )
  .use(createProjectRoute)
  .use(getProjectsRoute)
  .use(getProjectRoute);
