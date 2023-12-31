import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { EPermissions } from '../enums/permissions';
import { ProjectRole } from '../enums/roles';
import { hooks } from '../hooks';
import { isSignedIn } from '../hooks/isSignedInHook';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

export const projectsHandlers = new Elysia()
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
  )
  .post(
    '',
    async (context) => {
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
