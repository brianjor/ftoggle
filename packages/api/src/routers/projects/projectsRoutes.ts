import Elysia, { t } from 'elysia';
import { ProjectsController } from '../../controllers/projectsController';
import { hooks } from '../../hooks';
import { deriveUser } from '../../hooks/isSignedInHook';

const projectsController = new ProjectsController();

const getProjectsRoute = new Elysia()
  .use(hooks)
  .derive(deriveUser)
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

export const projectsRoutes = new Elysia({ prefix: '/projects' }).use(
  getProjectsRoute,
);
