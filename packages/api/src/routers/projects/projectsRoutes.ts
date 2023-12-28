import Elysia, { t } from 'elysia';
import { ProjectsController } from '../../controllers/projectsController';
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

export const projectsRoutes = new Elysia({ prefix: '/projects' })
  .use(new Elysia({ prefix: '/:projectId' }).use(featuresRoutes))
  .use(getProjectsRoute);
