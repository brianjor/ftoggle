import Elysia, { t } from 'elysia';
import { ProjectsController } from '../../controllers/projectsController';
import { RecordDoesNotExistError } from '../../errors/dbErrors';
import { hooks } from '../../hooks';
import { isSignedIn } from '../../hooks/isSignedInHook';
import { featuresRoutes } from './features/featuresRoutes';

const projectsController = new ProjectsController();

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

export const projectsRoutes = new Elysia({ prefix: '/projects' })
  .use(new Elysia({ prefix: '/:projectId' }).use(featuresRoutes))
  .use(getProjectsRoute)
  .use(getProjectRoute);
