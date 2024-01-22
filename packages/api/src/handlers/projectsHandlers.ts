import {
  projectIdReqs,
  projectNameReqs,
} from '@ftoggle/common/validations/projectsValidations';
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
              id: t.String(),
              name: t.String(),
              createdAt: t.Date(),
              modifiedAt: t.Date(),
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
      const { projectId, projectName } = body;
      const project = await projectsController.createProject(
        projectId,
        projectName,
      );
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
        projectId: t.String({
          maxLength: projectIdReqs.maxLength,
          minLength: projectIdReqs.minLength,
          pattern: projectIdReqs.pattern,
        }),
        projectName: t.String({
          maxLength: projectNameReqs.maxLength,
          minLength: projectNameReqs.minLength,
        }),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions: hasPermissions }) =>
          hasPermissions([UserPermission.CREATE_PROJECT]),
      ],
      transform({ body }) {
        const { projectName } = body;
        body.projectName = projectNameReqs.transforms(projectName);
      },
    },
  );
