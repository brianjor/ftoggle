import Elysia, { t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { ProjectRole } from '../enums/roles';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController(projectsController);

export const projectsHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async (context) => {
      const user = await context.getRequestUser();
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
      const { body } = context;
      const user = await context.getRequestUser();
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
        ({ isSignedIn }) => isSignedIn(),
        ({ hasPermissions }) =>
          hasPermissions([UserPermission.CREATE_PROJECT])(),
      ],
    },
  );
